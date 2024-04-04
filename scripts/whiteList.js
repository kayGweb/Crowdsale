const hre = require("hardhat");

const tokens = (n) => {
	return ethers.utils.parseEther(n.toString(), "ether");
};

async function main() {
	// get crowdsale contract
	const Crowdsale = await hre.ethers.getContractFactory("Crowdsale");
	const Token = await hre.ethers.getContractFactory("Token");
	const token = await Token.deploy("JayBird Token", "JBT", 1000000);
	const crowdsale = await Crowdsale.deploy(token.address, tokens(1), 1000000);

	console.log(`Token Contract ${await token.name()}`);
	console.log(`Crowdsale Contract ${await crowdsale.price()}`);
}

main();
