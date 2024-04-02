import { NavbarBrand } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import logo from "../logo.svg";

const Navigation = () => {
	return (
		<Navbar>
			<img alt="logo" src={logo} width="40px" height="40px" className="d-inline-block align-top mx-3" />
			<NavbarBrand href="#home">DApp ICO Crowdsale</NavbarBrand>
		</Navbar>
	);
};

export default Navigation;
