import { ethers } from "ethers";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
  if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is required");

  const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const deploymentPath = path.resolve(process.cwd(), "deployments", "sepolia", "ArtExpoFHE.json");
  const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf-8"));
  const contractAddress = deployment.address;
  const abi = deployment.abi;

  const expo = new ethers.Contract(contractAddress, abi, wallet);

  const metadataCID = process.env.ARTSYNC_METADATA_CID || "QmVUHP9dGRL32uzs6KWnchw8cGoXxRJi2tJW4qMw3cmzTV";
  const now = Math.floor(Date.now() / 1000);
  const startTime = Number(process.env.ARTSYNC_START || now + 60);
  const endTime = Number(process.env.ARTSYNC_END || now + 2 * 60 * 60);
  const enablePass = process.env.ARTSYNC_ENABLE_PASS === "false" ? false : true;

  console.log("scheduleExhibit params:", { metadataCID, startTime, endTime, enablePass });
  const tx = await expo.scheduleExhibit(metadataCID, startTime, endTime, enablePass);
  console.log("tx:", tx.hash);
  const receipt = await tx.wait();
  console.log("status:", receipt?.status);

  const nextId = await expo.nextExhibitId();
  const exhibitId = Number(nextId) - 1;
  console.log("Created ExhibitId:", exhibitId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


