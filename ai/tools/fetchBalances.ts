import { IndexerGrpcAccountPortfolioApi } from "@injectivelabs/sdk-ts";
import { IndexerRestExplorerApi } from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import axios from "axios";

const endpoints = getNetworkEndpoints(Network.Mainnet);
const indexerRestExplorerApi = new IndexerRestExplorerApi(`${endpoints.explorer}/api/explorer/v1`);

export const fetchInjectiveBalance = async (injectiveAddress: string) => {
  if (!injectiveAddress.startsWith("inj")) {
    return null;
  }

  try {
    const network = Network.Mainnet;
    const endpoints = getNetworkEndpoints(network);
    const indexerGrpcAccountPortfolioApi = new IndexerGrpcAccountPortfolioApi(endpoints.indexer);

    const portfolio = await indexerGrpcAccountPortfolioApi.fetchAccountPortfolioBalances(
      injectiveAddress
    );
    const portfolioNonZero = portfolio.bankBalancesList.filter(
      (coin, index) => coin.amount !== "0"
    );

    const cw20Balances = await indexerRestExplorerApi.fetchCW20BalancesNoThrow(injectiveAddress);

    const cw20BalancesNonZero = cw20Balances.filter((coin, index) => coin.balance !== "0");
    const formattedBank = await portfolioNonZero.map(async (item) => {
      const metadata = await fetchTokenMetadata(item.denom);

      if (!metadata) {
        return;
      }
      const decimals = metadata.decimals;
      const logo = metadata.logo;
      const symbol = metadata.symbol;
      return {
        symbol: symbol,
        balance: parseFloat(item.amount) / 10 ** decimals,
        logo: logo,
        address: item.denom,
      };
    });

    const formattedCW20 = await cw20BalancesNonZero.map(async (item) => {
      const metadata = await fetchTokenMetadata(item.contract_address);
      if (!metadata) {
        return;
      }
      const decimals = metadata.decimals;
      const logo = metadata.logo;
      const symbol = metadata.symbol;
      return {
        symbol: symbol,
        balance: parseFloat(item.balance) / 10 ** decimals,
        logo: logo,
        address: item.contract_address,
      };
    });
    return {
      bank: await Promise.all(formattedBank),
      cw20: await Promise.all(formattedCW20),
    };
  } catch (error) {
    console.error("❌ Error fetching Injective balance:", error);
    return null;
  }
};

const TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/InjectiveLabs/injective-lists/refs/heads/master/json/tokens/mainnet.json";

export const fetchTokenMetadata = async (denom: string) => {
  try {
    let tokenMetadata;
    if (denom.startsWith("peggy")) {
      const response = await axios.get(TOKEN_LIST_URL);
      tokenMetadata = response.data.find((token: any) => token.denom === denom);
    } else {
      const response = await axios.get(TOKEN_LIST_URL);
      tokenMetadata = response.data.find((token: any) => token.address === denom);
    }
    if (tokenMetadata) {
      return tokenMetadata;
    } else {
      return null;
    }
  } catch (error) {
    return `❌ Failed to fetch ${denom} metadata.`;
  }
};
