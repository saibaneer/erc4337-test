// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
//Entry point:  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
//Account Factory: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
import "@account-abstraction/contracts/core/EntryPoint.sol";


contract Account is IAccount {
    
    uint public count;
    address public owner;

    constructor(address _owner){
        owner = _owner;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 missingAccountFunds)
    external pure returns (uint256 validationData){
        return 0;
    }

    function execute() external {
        count++;
    }
}


contract AccountFactory {
    function createAccount(address _owner) external returns(address) {
        Account acc = new Account(_owner);
        return address(acc);
    }
}