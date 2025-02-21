import { ChainGrpcWasmApi, toBase64 } from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

interface RefDetails {
  ref_code: string;
  count: number;
  refferer: string;
}

const endpoints = getNetworkEndpoints(Network.Testnet);
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc);

const earlyAccessContract = "inj17rtl3ctxp2wqw48cgf0mga0qthsr7lygsqul2r";

export const getRefCodeDetails = async (injectiveAddress: string | null) => {
  try {
    if (injectiveAddress) {
      const ref_code = injectiveAddress.replace(/^inj/, "jecta");
      const queryFromObject = toBase64({ get_refferal: { ref_code: ref_code } });
      const contractState = await chainGrpcWasmApi.fetchSmartContractState(
        earlyAccessContract,
        queryFromObject
      );

      const decodedResponse = new TextDecoder().decode(
        Uint8Array.from(Object.values(contractState.data))
      );

      const parsedResponse: RefDetails = JSON.parse(decodedResponse);

      if (parsedResponse !== null || parsedResponse !== undefined) {
        return parsedResponse;
      }
    }
  } catch (error) {
    console.error("Error querying contract:", error);
    return null;
  }
};
