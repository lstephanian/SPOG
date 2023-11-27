require("@nomicfoundation/hardhat-toolbox");
let { expect } = require('chai');

// const { ethers } = require("ethers");

describe("RoundFactory", function () {
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    //deploy exp tokens contract
    ExperimentToken = await ethers.getContractFactory("ExperimentToken");
    exp = await ExperimentToken.deploy();
    expContract = await exp.waitForDeployment();
    expContractAddy = await exp.getAddress();
    // console.log("token contract:" + expContractAddy);

    // deploy round factory contract using token contract
    RoundFactory = await ethers.getContractFactory("RoundFactory");
    rf = await RoundFactory.deploy();
    rfContract = await rf.waitForDeployment();
    rfContractAddy = await rf.getAddress();
    // console.log("round factory contract:" + rfContractAddy)
  });

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      expect(await roundContractAddy).to.be.properAddress;
    });
  });

  describe("Create Round", function () {
    it("only owner should be able to access", async function () {
      await expect(rfContract.connect(addr1).createRound(expContractAddy, 10))
        .to.be.reverted;
      await expect(await rfContract.connect(owner).createRound(expContractAddy, 10))
        .to.emit(rfContract, "RoundCreated");     
    });
    it("should create a new round", async function () {
      await expect(await rfContract.connect(owner).createRound(expContractAddy, 10))
        .to.emit(rfContract, "RoundCreated");
      
    });
    it("should mint tokens to round contract", async function () {
      let mintAmount = 100;
      provider = ethers.provider;
      await rfContract.connect(owner).createRound(expContractAddy, mintAmount);
      let allRounds = await rfContract.connect(owner).allRounds();    
      await expContract.connect(owner).mint(allRounds[0], mintAmount);
      let balance = await expContract.balanceOf(allRounds[0]);
      expect(Number(balance))
        .to.equal(mintAmount);
    });
  });
  describe("AllRounds", function () {
    it("should return a list of addresses for all existing rounds", async function () {
      await rfContract.connect(owner).createRound(expContractAddy, 10);
      await rfContract.connect(owner).createRound(expContractAddy, 10);

      let rf = await rfContract.connect(owner).allRounds()      
      expect(rf.length).to.equal(2);
    });
  });
});
