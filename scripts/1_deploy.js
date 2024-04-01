const hre = require("hardhat");

async function main() {
	const NAME = "JayBird Token";
	const Symbol = "JBT";
	const TOTAL_SUPPLY = "1000000";
	const PRICE = ethers.utils.parseUnits("0.025", "ether");

	//Deploy token
	const Token = await hre.ethers.getContractFactory("Token");
	let token = await Token.deploy("JayBird Token", "JBT", TOTAL_SUPPLY);

	await token.deployed();
	console.log(`Token deployed to:, ${token.address}\n`);

	//Depoy Crowdsale
	const Crowdsale = await ethers.getContractFactory("Crowdsale");
	let crowdsale = await Crowdsale.deploy(token.address, PRICE, ethers.utils.parseUnits(TOTAL_SUPPLY, "ether"));

	await crowdsale.deployed();
	console.log(`Crowdsale deployed to : ${crowdsale.address}\n`);

	//Send tokens to crowdsale
	const transaction = await token.transfer(crowdsale.address, ethers.utils.parseUnits(TOTAL_SUPPLY, "ether"));
	await transaction.wait();

	console.log(`Transferred ${TOTAL_SUPPLY} tokens to ${crowdsale.address}\n`);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
