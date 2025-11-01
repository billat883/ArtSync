import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const d = await deploy("ArtPassToken", {
    from: deployer,
    args: ["ArtSync Pass", "ASPASS"],
    log: true,
  });
  log(`ArtPassToken deployed at ${d.address}`);
};

export default func;
func.id = "deploy_artpass";
func.tags = ["ArtPass", "all"];


