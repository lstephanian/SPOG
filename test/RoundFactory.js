require("@nomicfoundation/hardhat-toolbox");
let { expect } = require('chai')

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

    });
    it("should create a new round", async function () {

    });
    it("should mint tokens to round contract", async function () {

    });
  });
  describe("AllRounds", function () {
    it("should return a list of addresses for all existing rounds", async function () {
     
    });
  });
});
