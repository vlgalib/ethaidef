// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CrossYieldVault
 * @dev Simple vault for CrossYield Agent demonstration
 * @notice This contract is for demo purposes only - real protocol interactions
 *         happen through established DeFi protocols (Aave, Compound, etc.)
 */
contract CrossYieldVault {
    mapping(address => uint256) public balances;
    mapping(address => string) public preferredProtocol;
    
    uint256 public totalDeposited;
    uint256 public constant MIN_DEPOSIT = 0.001 ether;
    
    event Deposit(address indexed user, uint256 amount, string protocol);
    event Withdraw(address indexed user, uint256 amount);
    event ProtocolChanged(address indexed user, string newProtocol);
    
    /**
     * @dev Deposit funds and set preferred DeFi protocol
     * @param protocol Preferred DeFi protocol (e.g., "Aave V3", "Compound V3")
     */
    function deposit(string memory protocol) external payable {
        require(msg.value >= MIN_DEPOSIT, "Minimum deposit is 0.001 ETH");
        require(bytes(protocol).length > 0, "Protocol cannot be empty");
        
        balances[msg.sender] += msg.value;
        preferredProtocol[msg.sender] = protocol;
        totalDeposited += msg.value;
        
        emit Deposit(msg.sender, msg.value, protocol);
    }
    
    /**
     * @dev Withdraw funds from vault
     * @param amount Amount to withdraw in wei
     */
    function withdraw(uint256 amount) external {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        require(amount > 0, "Amount must be > 0");
        
        balances[msg.sender] -= amount;
        totalDeposited -= amount;
        
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }
    
    /**
     * @dev Change preferred DeFi protocol
     * @param newProtocol New preferred protocol
     */
    function changeProtocol(string memory newProtocol) external {
        require(balances[msg.sender] > 0, "No balance to manage");
        require(bytes(newProtocol).length > 0, "Protocol cannot be empty");
        
        preferredProtocol[msg.sender] = newProtocol;
        emit ProtocolChanged(msg.sender, newProtocol);
    }
    
    /**
     * @dev Get user balance
     * @param user User address
     * @return User balance in wei
     */
    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }
    
    /**
     * @dev Get user's preferred protocol
     * @param user User address
     * @return Preferred protocol string
     */
    function getPreferredProtocol(address user) external view returns (string memory) {
        return preferredProtocol[user];
    }
    
    /**
     * @dev Get total contract stats
     * @return totalUsers Total number of users with balance > 0
     * @return totalValue Total value locked in contract
     */
    function getStats() external view returns (uint256 totalUsers, uint256 totalValue) {
        // Note: In production, this would need a more efficient way to count users
        totalValue = totalDeposited;
        totalUsers = 0; // Simplified for demo
    }
}