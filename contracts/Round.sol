// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import { Exp } from './Exp.sol';

contract Round is ERC20Holder, Ownable {
    uint yeaVotesUninformed;
    uint nayVotesUninformed;
    uint yeaVotesInformed;
    uint nayVotesInformed;
    uint numAbstains;
    uint public immutable TOPIC;
    uint public immutable ROUNDTYPE;
    bool public ended;

    event RoundCreated(string, uint);
    event RoundEnded(bool);

    //Note: in this example, roundtype 0 is free, roundtype 1 is SPOG
    constructor (string _topic, string _roundType){
        TOPIC = _topic;
        ROUNDTYPE = _roundType;

        emit RoundCreated(topic, roundType);
    }

    function closeRound() public owned {
        ended = true;
        emit AuctionEnded(ended);
    }

    function vote(uint _voteType){

    }

    function closeRound() public owned {

    }
    function voteInformed() public {

    }
    function voteUninformed() public {

    }
    function abstain() public {
        
    }
    function claimFunds() public {
        
    }
}