// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExperimentToken is ERC20, Ownable(msg.sender) {
    constructor() ERC20("Experiment", "EXP") {
        _mint(msg.sender, 0);
    }

    function mint(address beneficiary, uint256 mintAmount) external onlyOwner {
        _mint(beneficiary, mintAmount);
    }
}