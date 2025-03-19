
import { ChainGrpcStakingApi} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import {getNetworkEndpoints, Network } from '@injectivelabs/networks';

const endpoints = getNetworkEndpoints(Network.Mainnet);
const stakingApi = new ChainGrpcStakingApi(endpoints.grpc);

export const fetchInjectiveStakingInfo = async (walletAddress: string|null) => {
  try {
    
    if(!walletAddress){
        return [];
    }
    const delegations = await stakingApi.fetchDelegations({injectiveAddress:walletAddress});
    if (!delegations.delegations.length) {
      console.log("No staking data found for this wallet.");
      return [];
    }
    const validators = await stakingApi.fetchValidators();

    const stakingInfo = delegations.delegations.map((delegation) => {
      const validator = validators.validators.find(
        (v) => v.operatorAddress === delegation.delegation.validatorAddress
      );

      return {
        validatorName: validator ? validator.description.moniker : "Unknown Validator",
        validatorAddress: delegation.delegation.validatorAddress,
        stakedAmount: new BigNumberInBase(delegation.balance.amount).toNumber() / 1e18, 
        rewards: 0, 
      };
    });
    return stakingInfo;
  } catch (error) {
    console.error("Error fetching staking information:", error);
    return [];
  }
};
