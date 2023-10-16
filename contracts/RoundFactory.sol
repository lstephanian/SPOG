// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import './Round.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
//note: this contract gets published first

contract RoundFactory is Ownable(msg.sender) {
    address[] public rounds;
    event RoundCreated(address);

    //create our 4 auctions
    function createRound(address _ExperimentTokenAddress, uint _roundMintAmount) public onlyOwner {
        Round round = new Round(_ExperimentTokenAddress);
        rounds.push(address(round));

        //mint tokens to each round
        ExperimentToken exp = new ExperimentToken();
        exp.mint(address(round), _roundMintAmount);

        emit RoundCreated(address(round));
    }

    function allRounds() public view returns (address[] memory) {
        return rounds;
    }
}