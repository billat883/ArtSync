//////////////////////////////////////////////////////////////////////////
// Dynamically import ONLY in mock mode
//////////////////////////////////////////////////////////////////////////
import { JsonRpcProvider } from "ethers";
import { MockFhevmInstance } from "@fhevm/mock-utils";
import { FhevmInstance } from "../../fhevmTypes";

export const fhevmMockCreateInstance = async (parameters: {
  rpcUrl: string;
  chainId: number;
  metadata: { ACLAddress: `0x${string}`; InputVerifierAddress: `0x${string}`; KMSVerifierAddress: `0x${string}` };
}): Promise<FhevmInstance> => {
  const provider = new JsonRpcProvider(parameters.rpcUrl);
  const instance = await MockFhevmInstance.create(provider, provider, {
    aclContractAddress: parameters.metadata.ACLAddress,
    chainId: parameters.chainId,
    gatewayChainId: 55815,
    inputVerifierContractAddress: parameters.metadata.InputVerifierAddress,
    kmsContractAddress: parameters.metadata.KMSVerifierAddress,
    verifyingContractAddressDecryption: "0x0000000000000000000000000000000000000000",
    verifyingContractAddressInputVerification: "0x0000000000000000000000000000000000000000",
  });
  return instance;
};


