const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
	return ethers.utils.parseEther(n.toString(), "ether");
};

const ether = tokens;

describe("Crowdsale", () => {
	let crowdsale, token, accounts, deployer, user1;

	beforeEach(async () => {
		//Load Contracts
		const Crowdsale = await ethers.getContractFactory("Crowdsale");
		const Token = await ethers.getContractFactory("Token");

		//Deploy Token
		token = await Token.deploy("JayBird Token", "JBT", 1000000);

		//Configure accounts
		accounts = await ethers.getSigners();
		deployer = accounts[0];
		user1 = accounts[1];

		//Deploy Crowdsale
		crowdsale = await Crowdsale.deploy(token.address, ether(1), 1000000);

		//Send tokens to crowdsale
		let transaction = await token.connect(deployer).transfer(crowdsale.address, tokens(1000000));
		await transaction.wait();
	});

	describe("Deployment", () => {
		it("sends tokens ato the Crowdsale contract", async () => {
			expect(await token.balanceOf(crowdsale.address)).to.be.equal(tokens(1000000));
		});

		it("returns the price", async () => {
			expect(await crowdsale.price()).to.be.equal(ether(1));
		});

		it("returns token address", async () => {
			expect(await crowdsale.token()).to.be.equal(token.address);
		});
	});

	describe("Buying tokens", () => {
		let amount = tokens(10);
		let tranction, result;

		describe("Success", () => {
			beforeEach(async () => {
				transaction = await crowdsale.connect(user1).buyTokens(amount, { value: ether(10) });
				result = await transaction.wait();
			});

			it("transfers tokens", async () => {
				expect(await token.balanceOf(user1.address)).to.be.eq(amount);
				expect(await token.balanceOf(crowdsale.address)).to.be.eq(tokens(999990));
			});

			it("updates contracts ether balance", async () => {
				expect(await ethers.provider.getBalance(crowdsale.address)).to.be.eq(amount);
			});

			it("updates tokensSold", async () => {
				expect(await crowdsale.tokensSold()).to.eq(amount);
			});

			it("emits a Buy event", async () => {
				// --> https://hardhat.org/hardhat-chai-matchers/docs/reference#.emit
				await expect(transaction).to.emit(crowdsale, "Buy").withArgs(amount, user1.address);
			});
		});

		describe("Failure", () => {
			it("rejects insufficent ether", async () => {
				await expect(crowdsale.connect(user1).buyTokens(amount, { value: 0 })).to.be.revertedWith("Invalid Amount");
			});

			//it("rejects insufficent tokens", async () => {
			//await expect(crowdsale.connect(user1).buyTokens(tokens(1000001), {value: ether(10)})).to.be.revertedWith("Insufficient tokens in contract");
			//});
		});
	});
});
