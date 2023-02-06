import React, { useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { providers } from "ethers";
import { Strategy, ZkIdentity } from "@zk-kit/identity";
import { generateMerkleProof, genExternalNullifier, MerkleProof, Semaphore } from "@zk-kit/protocols";
import ListQuestions from "./ListQuestions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FormGroup, Form, Input, Row, Col, Button } from "reactstrap";

const initialValues = {
	content: "",
};

type Props = {
	sessionId: number;
};

export default function PostQuestionForm({ sessionId }: Props) {
	const [values, setValues] = useState(initialValues);
	const [shouldReloadQuestions, setShouldReloadQuestions] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	// post question
	const handlePostQuestion = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setShouldReloadQuestions(false);
		setIsProcessing(true);

		toast("Posting your question...");

		const provider = (await detectEthereumProvider()) as any;
		await provider.request({ method: "eth_requestAccounts" });

		const ethersProvider = new providers.Web3Provider(provider);
		const signer = ethersProvider.getSigner();
		const message = await signer.signMessage("ZeroTherapy - Sign message to proceed");

		const identity = new ZkIdentity(Strategy.MESSAGE, message);
		const identityCommitment = identity.genIdentityCommitment();

		const { content } = values;
		const signal = "post";

		// insert question into db first, because we need the questionId as nullifier
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				content,
			}),
		};
		const response = await fetch(`/api/question/insert/${sessionId}`, options);
		const questionId = await response.json();

		// fetch all identity commitments from session so that we can generate proofs
		let identityCommitments = [];
		const r = await fetch(`/api/session/identity/${sessionId}`, {
			method: "GET",
		});

		if (r.status === 500) {
			console.log(r);
		} else {
			identityCommitments = await r.json();
		}

		// generate proofs
		let merkleProof: MerkleProof;
		try {
			merkleProof = generateMerkleProof(20, BigInt(0), identityCommitments, identityCommitment);
		} catch (error: any) {
			toast.error("Join the AMA session before posting a question");
			setIsProcessing(false);
			return;
		}
		const nullifier = `${sessionId}_${questionId}`;
		const questionNullifier = Semaphore.genNullifierHash(genExternalNullifier(nullifier), identity.getNullifier());

		const witness = Semaphore.genWitness(identity.getTrapdoor(), identity.getNullifier(), merkleProof, questionNullifier, signal);

		const { proof, publicSignals } = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore_final.zkey");
		const solidityProof = Semaphore.packToSolidityProof(proof);

		const res = await fetch(`/api/question/post/${sessionId}`, {
			method: "POST",
			body: JSON.stringify({
				questionId,
				root: merkleProof.root.toString(),
				nullifierHash: publicSignals.nullifierHash,
				externalNullifier: publicSignals.externalNullifier,
				solidityProof: solidityProof,
			}),
		});

		if (res.status === 500) {
			const errorMessage = await res.text();
			toast.error(errorMessage);
		} else {
			setShouldReloadQuestions(true);
			setValues(initialValues);
			toast("Question posted");
		}
		setIsProcessing(false);
	};

	return (
		<div className="p-3">
			<Form onSubmit={handlePostQuestion}>
				<Row>
					<Col md="12">
						<FormGroup floating>
							<Input
								id="content"
								name="content"
								type="textarea"
								value={values.content}
								maxLength={500}
								rows={5}
								placeholder="Type your question..."
								onChange={handleInputChange}
								required
							/>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col md="12">
						<FormGroup>
							<div className="text-md-center text-lg-right">
								<Button color="primary" type="submit" className="form-control" disabled={isProcessing}>
									{isProcessing ? "Please wait..." : "Post Question"}
								</Button>
							</div>
						</FormGroup>
					</Col>
				</Row>
			</Form>
			<ListQuestions sessionId={sessionId} shouldReloadQuestions={shouldReloadQuestions} />
			<ToastContainer />
		</div>
	);
}
