pragma solidity ^0.8.0;

contract Bank {
    mapping(address => uint256) private _balances;

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        _balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(_balances[msg.sender] >= amount, "Insufficient balance");
        _balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function balances(address account) public view returns (uint256) {
        return _balances[account];
    }
}
