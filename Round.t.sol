import "forge-std/Test.sol";
import "contracts/Round.sol";
import "contracts/ExperimentToken.sol";

contract RoundTest is Test {

    Round round;
    ExperimentToken token;
    address tokenCreator = address(0x456);


    function setUp() public {
        vm.startPrank(tokenCreator);
        token = new ExperimentToken();
        round = new Round(address(token));
        vm.stopPrank();
    }   


    function test_Round_vote_RoundClosed() public {
        vm.startPrank(tokenCreator);
        round.closeRound();
        vm.stopPrank();
        vm.expectRevert("round closed");
        round.vote(1);
    }

    function test_Round_vote_VoteTypeOutOfRange() public {
        vm.expectRevert("needs to be in range");
        round.vote(0);
    }

    function test_Round_vote_VoteTypeInRange() public {
        round.vote(3);
//        assertEq(round.getVoterStatus(msg.sender), 3, "Vote type should be 3");
    }


    function test_Round_vote_CanOnlyVoteOnce() public {
        round.vote(1);
        vm.expectRevert("can only vote once");
        round.vote(2);
    }

    function test_Round_tallyVotesSPOG_RoundIsStillOpen() public {
        vm.startPrank(tokenCreator);
        vm.expectRevert("round is still open");
        round.tallyVotesSPOG();
        vm.stopPrank();
    }

    function test_Round_tallyVotesSPOG_NoVotesSubmitted() public {
        vm.startPrank(tokenCreator);
        round.closeRound();
        vm.expectRevert("no votes submitted");
        round.tallyVotesSPOG();
        vm.stopPrank();
    }

    function test_Round_tallyVotesFREE_RoundStillOpen() public {
        vm.startPrank(tokenCreator);
        vm.expectRevert("round is still open");
        round.tallyVotesFREE();
        vm.stopPrank();
    }

    function test_Round_tallyVotesFREE_NoVotesSubmitted() public {
        vm.startPrank(tokenCreator);
        round.closeRound();
        vm.expectRevert("no votes submitted");
        round.tallyVotesFREE();
        vm.stopPrank();
    }

    function test_Round_claimFunds_RoundIsOpen() public {
        vm.startPrank(tokenCreator);
        vm.expectRevert("round is still open");
        round.claimFunds();
        vm.stopPrank();
    }

    function test_Round_claimFunds_RoundClosed() public {
        vm.startPrank(tokenCreator);
        round.closeRound();
        vm.stopPrank();
        round.claimFunds();
        vm.expectRevert("can only withdraw once");
        round.claimFunds();
    }

    function test_Round_claimFunds_VoterHasVoted() public {
        round.vote(1);
        vm.startPrank(tokenCreator);
        round.closeRound();
        vm.stopPrank();
        round.claimFunds();
    }

    function test_Round_claimFunds_VoterHasVotedInformed() public {
        round.vote(2);
        vm.startPrank(tokenCreator);
        round.closeRound();
        round.tallyVotesFREE();
        vm.stopPrank();
        round.claimFunds();
//        assertTrue(round.getVoterStatus(msg.sender) == 2, "Voter should have voted informed");
    }

}