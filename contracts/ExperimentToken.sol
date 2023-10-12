// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExperimentToken is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("Experiment", "EXP") {
        _mint(msg.sender, initialSupply);
    }
}