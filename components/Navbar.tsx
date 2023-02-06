// reactstrap components
import { Navbar, NavbarBrand, NavbarToggler, NavItem, Nav, NavLink, Button } from "reactstrap";
import Image from "next/image";
import logo from "../public/images/zero-therapy.png";

export default function NavBar() {
	return (
		<div>
			<Navbar expand="md" style={{ backgroundColor: "#180526", padding: "10px" }}>
				<NavbarBrand href="/" className="pl-3">
					<Image height="30" width="210" alt="ZeroTherapy logo" key={Date.now()} src={logo} />
				</NavbarBrand>
				<NavbarToggler onClick={function noRefCheck() {}} />

				<Nav className="me-auto" navbar>
					<NavItem className="float-right">
						<NavLink href="/host">
							<Button color="primary">I&apos;m a counselor</Button>
						</NavLink>
					</NavItem>
				</Nav>
			</Navbar>
		</div>
	);
}
