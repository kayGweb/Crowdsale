//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Token.sol";

contract Crowdsale {
    address public owner;
    Token public token;
    uint256 public price;
    uint256 public maxTokens;
    uint256 public tokensSold;

    event Buy(uint256 amount, address buyer);
    event Finalize(uint256 tokensSold, uint256 ethRaised);

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(Token _token, uint256 _price, uint256 _maxTokens) {
        owner = msg.sender;
        token = _token;
        price = _price;
        maxTokens = _maxTokens;
    }

    receive() external payable {
        uint256 amount = msg.value / price;
        buyTokens(amount * 1e18);
    }

    function buyTokens(uint256 _amount) public payable {
        require(msg.value == (_amount / 1e18) * price, "Invalid Amount");
        require(token.balanceOf(address(this)) >= _amount); //write test for his homework
        require(token.transfer(msg.sender, _amount));
        //Update token sold
        tokensSold += _amount;
        //emit event
        emit Buy(_amount, msg.sender);
    }

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
    }

    function finalize() public onlyOwner {
        //require(msg.sender == owner);
        //send Token to crowdsale creator
        require(token.transfer(owner, token.balanceOf(address(this))));

        // Send Ether held in this contract to crowdsale creator
        uint256 currentETHBalance = address(this).balance; //get remaining balance
        (bool sent, ) = owner.call{value: currentETHBalance}(""); //send Ether from Contract to owner
        require(sent, "Failed to send Ether");
        //call event
        emit Finalize(tokensSold, currentETHBalance);
    }
}
