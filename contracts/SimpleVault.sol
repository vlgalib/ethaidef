// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleVault {
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    
    function deposit() external payable {
        require(msg.value > 0, "Amount must be > 0");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }
    
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
}