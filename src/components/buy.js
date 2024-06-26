import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { ethers } from "ethers";

const Buy = ({ provider, price, crowdsale, setIsLoading }) => {
	const [amount, setAmount] = useState(0);
	const [isWaiting, setisWaiting] = useState(false);

	const buyHandler = async (e) => {
		e.preventDefault(); //prevent page reload
		setisWaiting(true);

		try {
			const signer = provider.getSigner();
			const value = ethers.utils.parseUnits((amount * price).toString(), "ether");
			const formattedAmount = ethers.utils.parseUnits(amount.toString(), "ether");
			const transaction = await crowdsale.connect(signer).buyTokens(formattedAmount, { value: value });
			await transaction.wait();
		} catch {
			console.log("Error");
			window.alert("Error");
		}

		setIsLoading(true);
	};

	return (
		<Form onSubmit={buyHandler} style={{ maxWidth: "800px", margin: "50px auto" }}>
			<Form.Group as={Row}>
				<Col>
					<Form.Control type="number" placeholder="Enter Amount" onChange={(e) => setAmount(e.target.value)} />
				</Col>
				<Col className="text-center">
					{isWaiting ? (
						<Spinner animation="border" role="status" />
					) : (
						<Button variant="primary" type="submit" style={{ width: "100%" }}>
							Buy Tokens
						</Button>
					)}
				</Col>
			</Form.Group>
		</Form>
	);
};

export default Buy;
