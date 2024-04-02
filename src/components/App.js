import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { ethers } from "ethers";
import config from "../config.json";

//componets
import TOKEN_ABI from "../abis/Token.json";
import CROWDSALE_ABI from "../abis/Crowdsale.json";
import Navigation from "./Navigation";
import Info from "./Info";
import Loading from "./Loading";
import Progress from "./Progress";

function App() {
	const [provider, setProvider] = useState(null);
	const [account, setAccount] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [crowdsale, setCrowdsale] = useState(null);
	const [accountBalance, setAccountBalance] = useState(0);
	const [price, setPrice] = useState(0);
	const [maxTokens, setMaxTokens] = useState(0);
	const [tokensSold, setTokensSold] = useState(0);

	const loadBlockchainData = async () => {
		//initiate provider
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(provider);

		//ChainID
		const { chainId } = await provider.getNetwork();
		console.log(chainId);

		//Initiate contracts
		const token = new ethers.Contract(config[chainId].token.address, TOKEN_ABI, provider);
		const crowdsale = new ethers.Contract(config[chainId].crowdsale.address, CROWDSALE_ABI, provider);
		setCrowdsale(crowdsale);

		//request account access
		const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
		let account = ethers.utils.getAddress(accounts[0]);
		setAccount(account);

		//Fetch account balance
		const accountBalance = ethers.utils.formatUnits(await token.balanceOf(account), 18);
		setAccountBalance(accountBalance);

		// fetch price and max tokens, tokens sold
		const price = ethers.utils.formatUnits(await crowdsale.price(), 18);
		setPrice(price);
		const maxTokens = ethers.utils.formatUnits(await crowdsale.maxTokens(), 18);
		setMaxTokens(maxTokens);
		const tokensSold = ethers.utils.formatUnits(await crowdsale.tokensSold(), 18);
		setTokensSold(tokensSold);

		setIsLoading(false);
	};

	useEffect(() => {
		if (isLoading) {
			loadBlockchainData();
		}
	}, [isLoading]);

	return (
		<Container>
			<Navigation />

			<h1 className="text-center my-5">Introducing DApp Token</h1>

			{isLoading ? (
				<Loading />
			) : (
				<>
					<p className="text-center">
						<strong>Current Price:</strong>
						{price} ETH
					</p>
					<Progress maxTokens={tokensSold} tokensSold={tokensSold} />
				</>
			)}

			<hr />
			{account && <Info account={account} accountBalance={accountBalance} />}
		</Container>
	);
}

export default App;
