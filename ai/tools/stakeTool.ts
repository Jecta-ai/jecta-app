import { ChainGrpcStakingApi } from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const endpoints = getNetworkEndpoints(Network.Mainnet);
const chainGrpcStakingApi = new ChainGrpcStakingApi(endpoints.grpc);

export const fetchValidators = async () => {
  try {

    const validatorsResponse = await chainGrpcStakingApi.fetchValidators();
    const validators = validatorsResponse.validators;

    if (!validators || validators.length === 0) {
      return [];
    }

    return validators.map((validator) => ({
      moniker: validator.description?.moniker || "Unknown",
      address: validator.operatorAddress,
      commission: (parseFloat(validator.commission?.commissionRates.rate || "0") * 100).toFixed(2) + "%", 
      tokens: (parseFloat(validator.tokens) / 1e18).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " INJ", 
      status: validator.jailed ? "❌ Jailed" : "✅ Active",
      selfDelegation: (parseFloat(validator.minSelfDelegation) / 1e18).toFixed(2) + " INJ",
      delegatorShares: (parseFloat(validator.delegatorShares) / 1e18).toFixed(2) + " INJ",
    }));
  } catch (error) {
    
    return [];
  }
};
