import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, get, execute, log } = hre.deployments;

  const artPass = await get("ArtPassToken");

  const expo = await deploy("ArtExpoFHE", {
    from: deployer,
    args: [artPass.address],
    log: true,
  });
  log(`ArtExpoFHE deployed at ${expo.address}`);

  // set minter on ArtPassToken to ArtExpoFHE
  await execute("ArtPassToken", { from: deployer, log: true }, "setMinter", expo.address);
};

export default func;
func.id = "deploy_art_expo_fhe";
func.tags = ["ArtExpo", "all"];


