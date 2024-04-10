// SPDX-License-Identifier: UNLICENSED
//author: @lstephanian

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Round is Ownable(msg.sender) {
    int votesUninformed = 0;
    int votesInformed = 0;
    int votesAbstain = 0;
    int informedClaimable = 0;
    int uninformedClaimable = 0;
    int abstainedClaimable = 0;
    bool public ended = false;

    mapping(address => int) private voteMap;
    mapping(address => bool) private withdrawalMap;

    event RoundCreated(bool);
    event RoundEnded(bool);
    event VoteSubmitted(int, int);
    event VotesTallied(int informedClaimable, int uninformedClaimable, int abstainedClaimable);
    event BitRefundReceived(address, int);

    function closeRound() public onlyOwner {
        ended = true;
        emit RoundEnded(ended);
    }

    function getRoundStatus() public view returns(bool) {
        return(ended);
    }

    function vote(int _voteType) public {
        require(ended==false, "round closed");
        require(_voteType > 0 && _voteType < 4, 'needs to be in range');
        require(voteMap[msg.sender] == 0, 'can only vote once');

        voteMap[msg.sender] = _voteType;

        if (_voteType==1){
            votesAbstain += 1;
            emit VoteSubmitted(_voteType, votesAbstain);
        }
        if (_voteType==2){
            votesUninformed += 1;
            emit VoteSubmitted(_voteType, votesUninformed);
        }
        if (_voteType==3) {
            votesInformed += 1;
            emit VoteSubmitted(_voteType, votesInformed);
        }
    }

    function getVoterStatus(address beneficiary) public view returns(int) {
        return(voteMap[beneficiary]);
    }

    function tallyVotesExpensive() public onlyOwner {
        require(ended, 'round is still open');

        int votesTotal = votesInformed + votesUninformed; 
        require(votesTotal > 0, "no votes submitted");

        int halfVotesTotal = votesTotal / 2;
        int uninformedRatio = votesUninformed / votesTotal;
        int informedRatio = votesInformed / votesTotal;
        int b = (halfVotesTotal - uninformedRatio) * informedRatio; 

        // Ensure that 'b' is positive
        if (b < 0) {
            b = 0;
        }

        int v = ((votesTotal - 1) / (votesTotal * votesTotal)) + (1  / votesTotal);

        // Limit 'v' to prevent overflow
        if (v * 10**18 > 3**18) {
            v = 3**18;
        }

        // Calculate claimable amounts
        informedClaimable = Math.max(b - 1, 0);
        uninformedClaimable = Math.max(b, 0);
        abstainedClaimable = Math.max(b * 10**18 - v, 0);

        emit VotesTallied(informedClaimable, uninformedClaimable, abstainedClaimable);
    }
    
    function tallyVotesFree() public onlyOwner {
        require(ended, 'round is still open');

        int votesTotal = votesInformed + votesUninformed;
        require(votesTotal > 0, "no votes submitted");

        int b = (int(votesTotal) / 2 - (int(votesUninformed) / int(votesTotal))) * int(votesInformed) / int(votesTotal);

        if (b > 1) {
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
        int amount;

        if (voteMap[msg.sender] == 1){
            value = abstainedClaimable;
        }
        if (voteMap[msg.sender] == 2){
            value = votesUninformed;
        }
        if (voteMap[msg.sender] == 3){
            value = votesInformed;
        }        
        
        withdrawalMap[msg.sender] = true;
        
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
        
        emit BitRefundReceived(msg.sender, value);
    }
}
