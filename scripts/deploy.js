const hre = require('hardhat');

async function main() {
  const experimentToken = await hre.ethers.deployContract('ExperimentToken');
  await experimentToken.waitForDeployment();
  console.log(`ExperimentToken deployed to ${experimentToken.target}`);

  const roundFactory = await hre.ethers.deployContract('RoundFactory');
  await roundFactory.waitForDeployment();
  console.log(`RoundFactory deployed to ${roundFactory.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});