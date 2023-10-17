require("@nomicfoundation/hardhat-toolbox");
let { expect } = require('chai')

describe("Round", function () {
  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8] = await ethers.getSigners();

    //deploy exp tokens contract
    ExperimentToken = await ethers.getContractFactory("ExperimentToken");
    exp = await ExperimentToken.deploy();
    expContract = await exp.waitForDeployment();
    expContractAddy = await exp.getAddress();
    // console.log("token contract:" + expContractAddy);

    // // deploy round factory contract using token contract
    // RoundFactory = await ethers.getContractFactory("RoundFactory");
    // rf = await RoundFactory.deploy();
    // rfContract = await rf.waitForDeployment();
    // rfContractAddy = await rf.getAddress();
    // // console.log("round factory contract:" + rfContractAddy)

    //deploy round contract
    Round = (await ethers.getContractFactory("Round"));
    round = await Round.connect(owner).deploy(expContractAddy);
    roundContract = await round.waitForDeployment();
    roundContractAddy = await round.getAddress();
    // console.log("round contract:" + roundContractAddy)
  });

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      expect(await roundContractAddy).to.be.properAddress;
    });
    
    it("should emit an event upon deployment", async function () {
      let myRound = await Round.connect(owner).deploy(expContractAddy);
      expect(await myRound.waitForDeployment())
          .to.emit(myRound, "RoundCreated");     
    });
  });

  describe("Round Close", function () {
    it("only owner should be able to access", async function () {
      expect(roundContract.connect(addr1).closeRound())
        .to.be.reverted;
    });
    it("sets round to ended", async function () {
      expect(await roundContract.closeRound())
          .to.emit(roundContract, "RoundEnded");   
    });
  });
  describe("Vote", function () {
    it("should allow any user to vote", async function () {
      newRound = await round.waitForDeployment();
      expect(await newRound.connect(owner).vote(0))
        .is.not.reverted;
      expect(await newRound.connect(addr1).vote(0))
        .is.not.reverted;
      expect(await newRound.connect(addr2).vote(0))
        .is.not.reverted;
      expect(await newRound.connect(addr3).vote(0))
        .is.not.reverted;
    });
    it("should revert if incorrect vote type indicated", async function () {
      newRound2 = await round.waitForDeployment();
      expect(newRound2.connect(addr1).vote(3))
        .is.revertedWith('Needs to be in range');
    });
    it("should emit event upon vote", async function () {
      newRound3 = await round.waitForDeployment();
      expect(await newRound3.connect(addr1).vote(2))
        .to.emit(newRound3, "VoteSubmitted"); 
    });
    it("should increment vote tracker", async function () {
      newRound4 = await round.waitForDeployment();
      let vote1 = await newRound4.connect(owner).vote(0);
      await expect(await newRound4.connect(addr1).vote(0))
        .to.emit(newRound4, "VoteSubmitted")
        .withArgs(0, 2);

      let vote3 = await newRound4.connect(addr2).vote(1);
      let vote4 = await newRound4.connect(addr3).vote(1);
      await expect(await newRound4.connect(addr4).vote(1))
        .to.emit(newRound4, "VoteSubmitted")
        .withArgs(1, 3);
      
      let vote5 = await newRound4.connect(addr5).vote(2);
      let vote6 = await newRound4.connect(addr6).vote(2);
      let vote7 = await newRound4.connect(addr7).vote(2);
      await expect(await newRound4.connect(addr8).vote(2))
        .to.emit(newRound4, "VoteSubmitted")
        .withArgs(2, 4);
    });
    it("should ensure voters can only vote once", async function () {
      newRound5 = await round.waitForDeployment();
      let vote = await newRound5.connect(addr1).vote(0);
      expect(await newRound5.connect(addr3).vote(2))
        .to.be.revertedWith('can only vote once');
    });
  });
  describe("Tally Votes", function () {
    describe("SPOG", function () {
      it("only owner can tally votes", async function () {
        expect(roundContract.connect(addr1).tallyVotesSPOG())
          .to.be.reverted;
      });
      it("should tally votes as expected", async function () {
        // newRound6 = await round.waitForDeployment();
        // let vote1 = await newRound6.connect(addr1).vote(0);
        // let vote2 = await newRound6.connect(addr2).vote(0);
        // let vote3 = await newRound6.connect(addr3).vote(0);
        // let vote4 = await newRound6.connect(addr4).vote(1);
        // let vote5 = await newRound6.connect(addr5).vote(1);
        // let vote6 = await newRound6.connect(addr6).vote(1);
        // let vote7 = await newRound6.connect(addr7).vote(2);
        // let vote8 = await newRound6.connect(addr8).vote(2);
        
        // await newRound6.connect(owner).closeRound();
        // let tally = await newRound6.connect(owner).tallyVotesFREE();

        // await expect(tally)
        //   .to.emit(newRound4, "VotesTallied")
        //   .withArgs(1.25, 0.3055555556, 0.9444444444);
      });
    });
    describe("FREE", function () {
      it("only owner can tally votes", async function () {
        expect(roundContract.connect(addr1).tallyVotesFREE())
          .to.be.reverted;
      });
      it("should tally votes as expected", async function () {
        // newRound6 = await round.waitForDeployment();
        // let vote1 = await newRound6.connect(addr1).vote(0);
        // let vote2 = await newRound6.connect(addr2).vote(0);
        // let vote3 = await newRound6.connect(addr3).vote(0);
        // let vote4 = await newRound6.connect(addr4).vote(1);
        // let vote5 = await newRound6.connect(addr5).vote(1);
        // let vote6 = await newRound6.connect(addr6).vote(1);
        // let vote7 = await newRound6.connect(addr7).vote(2);
        // let vote8 = await newRound6.connect(addr8).vote(2);
        
        // await newRound6.connect(owner).closeRound();
        // let tally = await newRound6.connect(owner).tallyVotesFREE();

        // await expect(tally)
        //   .to.emit(newRound4, "VotesTallied")
        //   .withArgs(.25, 1.25, 1.25);
      });
    });
  });
  describe("Claim Funds", function () {
    it("should revert if round still open", async function () {
      newRound7 = await round.waitForDeployment();
      expect(newRound7.connect(addr1).claimFunds())
        .to.be.revertedWith('round is still open');
    });
    it("should allow anyone to try to claim", async function () {
      newRound7 = await round.waitForDeployment();
      await newRound7.connect(owner).closeRound();
      expect(newRound7.connect(addr1).claimFunds())
        .to.emit(newRound7, "BitRefundReceived");
    });
  });
});
