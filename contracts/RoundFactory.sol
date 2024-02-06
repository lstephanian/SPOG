// SPDX-License-Identifier: UNLICENSED
//author: @lstephanian

pragma solidity ^0.8.9;

import './Round.sol';
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoundFactory is Ownable(msg.sender) {
    address[] public rounds;
    event RoundCreated(address);
    event AllRounds(address[]);
    ExperimentToken exp = new ExperimentToken();

    //create round
    function createRound() public onlyOwner {
        Round round = new Round();
        
        emit RoundCreated(address(round));
        rounds.push(address(round));
    }

    function allRounds() public view returns (address[] memory) {
        return rounds;
    }
}