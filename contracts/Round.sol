// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ExperimentToken } from './ExperimentToken.sol';

contract Round is Ownable(msg.sender) {
    uint votesUninformed;
    uint votesInformed;
    uint votesAbstain;
    uint informedClaimable;
    uint uninformedClaimable;
    uint abstainedClaimable;

    mapping(address => uint) private voteMap;
    mapping(address => bool) private withdrawalMap;

    address public immutable TOKEN_ADDRESS;
    bool public ended = false;

    event RoundCreated(bool);
    event RoundEnded(bool);
    event VoteSubmitted(uint, uint);
    event VotesTallied(uint, uint, uint);
    event BitRefundReceived(address, uint);
    ExperimentToken exp = ExperimentToken(TOKEN_ADDRESS);


    constructor (address _tokenAddress){
        TOKEN_ADDRESS = _tokenAddress;

        emit RoundCreated(true);
    }

    function closeRound() public onlyOwner {
        ended = true;
        emit RoundEnded(ended);
    }

    function vote(uint _voteType) public {
        require(_voteType == 0 || _voteType == 1 || _voteType == 2, 'needs to be in range');
        require(voteMap[msg.sender] == 0, 'can only vote once');

        voteMap[msg.sender] = _voteType;

        if (_voteType==0){
            votesAbstain += 1;
            emit VoteSubmitted(_voteType, votesAbstain);
        }
        if (_voteType==1){
            votesUninformed += 1;
            emit VoteSubmitted(_voteType, votesUninformed);
        }
        if (_voteType==2) {
            votesInformed += 1;
            emit VoteSubmitted(_voteType, votesInformed);
        }
    }

    function tallyVotesSPOG() public onlyOwner {
        require(ended, 'round is still open');

        uint votesTotal = votesInformed + votesUninformed;
        uint b = (votesTotal/2 - votesUninformed / votesTotal) * votesInformed / votesTotal; 
        uint v = ((votesTotal - 1) / (votesTotal ^ 2)) + (1  / votesTotal);
        if (v * 10 > .3 * 10) {
            v = .3 * 10;
        }

        if (b-1 > 0) {
            informedClaimable = b-1;
        }
        if (b > 0) {
            uninformedClaimable = b;
        }
        if (b-v > 0) {
            abstainedClaimable = b-v;
        }
        emit VotesTallied(informedClaimable, uninformedClaimable, abstainedClaimable);
    }
    
    function tallyVotesFREE() public onlyOwner {
        require(ended, 'round is still open');
        
        uint votesTotal = votesInformed + votesUninformed;
        uint b = (votesTotal / 2 - votesUninformed / votesTotal) * votesInformed / votesTotal;

        if (b-1 > 0) {
            informedClaimable = b-1;
        }
        if (b > 0) {
            uninformedClaimable = b;
            abstainedClaimable = b;
        }
        emit VotesTallied(informedClaimable, uninformedClaimable, abstainedClaimable);
    }

    function claimFunds() public {
        require(ended, 'round is still open');
        require(withdrawalMap[msg.sender] == false, 'can only withdraw once');
        uint amount;

        if (voteMap[msg.sender] == 0){
            amount = abstainedClaimable;
        }
        if (voteMap[msg.sender] == 1){
            amount = votesUninformed;
        }
        if (voteMap[msg.sender] == 2){
            amount = votesInformed;
        }
        
        emit BitRefundReceived(msg.sender, amount);
        withdrawalMap[msg.sender] = true;

        exp.transfer(msg.sender, amount);
    }
}