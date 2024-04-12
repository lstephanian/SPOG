const hre = require('hardhat');

async function main() {  
  const round = await hre.ethers.deployContract('Round');
  await round.waitForDeployment();
  console.log(`Round deployed to ${round.target}`); 
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});