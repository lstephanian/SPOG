require("@nomicfoundation/hardhat-toolbox");
let { expect } = require('chai')

describe("ExperimentToken", function () {
  beforeEach(async function () {
    [owner, addr1, addr2, addr3, addr4, addr5, addr6, addr7, addr8] = await ethers.getSigners();

    //deploy exp tokens contract
    ExperimentToken = await ethers.getContractFactory("ExperimentToken");
    exp = await ExperimentToken.deploy();
    expContract = await exp.waitForDeployment();
    expContractAddy = await exp.getAddress();
  });

  describe("Deployment", function () {
    it("should deploy successfully", async function () {
      expect(await expContractAddy).to.be.properAddress;
    });
  });
  describe("Mint", function () {
    it("only owner should be able to call mint function", async function () {
    });
    it("should mint tokens", async function () {
    });
  });
});
