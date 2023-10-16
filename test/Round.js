require("@nomicfoundation/hardhat-toolbox");
let { expect } = require('chai')

describe("Round", function () {
  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

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

  // describe("Round Close", function () {

  // });
  // describe("Vote", function () {

  // });
  // describe("Tally Votes", function () {

  // });
  // describe("Claim Funds", function () {

  // });
});
