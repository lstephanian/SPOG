// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import './Round.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
//note: this contract gets published first

contract RoundFactory is Ownable(msg.sender) {
    address[] public rounds;
    event RoundCreated(address);
    event AllRounds(address[]);
    ExperimentToken exp = new ExperimentToken();

    //create our 4 auctions
    function createRound(address _ExperimentTokenAddress, uint _roundMintAmount) public onlyOwner {
        Round round = new Round(_ExperimentTokenAddress);
<<<<<<< HEAD
        
        emit RoundCreated(address(round));
        rounds.push(address(round));

        //auto mint tokens to each round
        exp.mint(address(round), _roundMintAmount);
    }
=======

        emit RoundCreated(address(round));
        rounds.push(address(round));
        
        //auto mint tokens to each round
        exp.mint(address(round), _roundMintAmount);    }
>>>>>>> 0cdae051bcd41de1c2216b5fdd5996ece089f9e8

    function allRounds() public view returns (address[] memory) {
        return rounds;
    }
}