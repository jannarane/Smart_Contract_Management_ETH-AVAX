// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Assessment {
    uint256 public balance;
    address public owner;

    event BuyItem(address indexed user, uint256 amount);
    event RedeemItem(address indexed user, uint256 amount);

    constructor(uint256 _initBalance) {
        balance = _initBalance;
        owner = msg.sender;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function buyItem(uint256 amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        balance += amount;
        emit BuyItem(msg.sender, amount); //calls buy item event
    }

    function redeemItem(uint256 amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(balance >= amount, "Insufficient JRN Tokens!");
        balance -= amount;
        emit RedeemItem(msg.sender, amount);//calls redeem item event
    }
    }
}