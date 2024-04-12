// SPDX-License-Identifier: UNLICENSED
//author: @lstephanian

pragma solidity ^ 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract Round is Ownable(msg.sender) {
    int256 votesUninformed = 0;
    int256 votesInformed = 0;
    int256 votesAbstain = 0;
    int256 informedClaimable = 0;
    int256 uninformedClaimable = 0;
    int256 abstainedClaimable = 0;
    bool public ended = false;

    mapping(address => int) private voteMap;
    mapping(address => bool) private withdrawalMap;

    event RoundCreated(bool);
    event RoundEnded(bool);
    event VoteSubmitted(int, int);
    event VotesTallied(int informedClaimable, int uninformedClaimable, int abstainedClaimable);
    event BitRefundReceived(address, uint);

    function closeRound() public onlyOwner {
        require(ended==false, "round already closed");
        ended = true;
        emit RoundEnded(ended);
    }

    function getRoundStatus() public view returns(bool) {
        return (ended);
    }

    function vote(int _voteType) public {
        require(ended == false, "round closed");
        require(_voteType > 0 && _voteType < 4, 'needs to be in range');
        require(voteMap[msg.sender] == 0, 'can only vote once');

        voteMap[msg.sender] = _voteType;

        if (_voteType == 1) {
            votesAbstain += 1;
            emit VoteSubmitted(_voteType, votesAbstain);
        }
        if (_voteType == 2) {
            votesUninformed += 1;
            emit VoteSubmitted(_voteType, votesUninformed);
        }
        if (_voteType == 3) {
            votesInformed += 1;
            emit VoteSubmitted(_voteType, votesInformed);
        }
    }

    function getVoterStatus(address beneficiary) public view returns(int) {
        return (voteMap[beneficiary]);
    }

    function tallyVotesExpensive() public onlyOwner {
        
        // here, 1 is same 10 ** 18
        require(ended, 'round is still open');

        int256 votesTotal = votesInformed + votesUninformed;
        require(votesTotal > 0, "no non-abstain votes submitted");

        int256 b = 10 ** 18 * (votesTotal / 2 - votesUninformed / votesTotal) * votesInformed / votesTotal;
        int256 v = 10 ** 18 * ((votesTotal - 1) / (votesTotal * votesTotal)) + (1 / votesTotal);

        // allows for up to 10**59 votes
        if (v > 3 * 10 ** 18) {
            v = 3 * 10 ** 18;
        }

        if (b > 10 ** 18) {
            informedClaimable = b - 10 ** 18;
        }
        if (b > 0) {
            uninformedClaimable = b;
        }
        if (b - v > 0) {
            abstainedClaimable = b > v ? b - v : int(0);
        }
        emit VotesTallied(informedClaimable, uninformedClaimable, abstainedClaimable);
    }

    function tallyVotesFree() public onlyOwner {
        require(ended, 'round is still open');

        int256 votesTotal = votesInformed + votesUninformed;
        require(votesTotal > 0, "no votes submitted");

        int256 b = 10 ** 18 * (int(votesTotal) / 2 - (int(votesUninformed) / int(votesTotal))) * int(votesInformed) / int(votesTotal);

        if (b > 10 ** 18) {
            informedClaimable = b - 10 ** 18;
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

        uint claimAmt;

        if (voteMap[msg.sender] == 1) {
            claimAmt = uint(abstainedClaimable);
        }
        if (voteMap[msg.sender] == 2) {
            claimAmt = uint(votesUninformed);
        }
        if (voteMap[msg.sender] == 3) {
            claimAmt = uint(votesInformed);
        }

        //indicate msg.sender has withdrawn
        withdrawalMap[msg.sender] = true;

        //send eth
        (bool sent, bytes memory data) = msg.sender.call{value: claimAmt}("");
        require(sent, "Failed to send Ether");

        emit BitRefundReceived(msg.sender, claimAmt);
    }
}