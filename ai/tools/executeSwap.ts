import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import axios from "axios";

export async function extractSwapDetails(message: string) {
  const regex = /swap (\d+(?:\.\d+)?) (\w+) to (\w+)/i;
  const match = message.match(regex);

  if (match) {
    const amount = parseFloat(match[1]);
    const from = match[2].toUpperCase();
    const fromMetaData = await fetchTokenMetadata(from);

    if (fromMetaData == "error") {
      const status = "failed_from";
      return { from: from, from_metadata: "", to: "", to_metadata: "", amount: 0, status: status };
    }
    const to = match[3].toUpperCase();
    const toMetaData = await fetchTokenMetadata(to);
    if (toMetaData == "error") {
      const status = "failed_to";
      return { from: "", from_metadata: "", to: to, to_metadata: "", amount: 0, status: status };
    }
    const status = "success";

    return {
      from: from,
      from_metadata: fromMetaData,
      to: to,
      to_metadata: toMetaData,
      amount: amount,
      status: status,
    }; 
  } else {
    const status = "failed";

    return { from: "", from_metadata: "", to: "", to_metadata: "", amount: 0, status: status }; 
  }
}

const TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/InjectiveLabs/injective-lists/refs/heads/master/json/tokens/mainnet.json";

export const fetchTokenMetadata = async (ticker: string) => {
  try {
    const response = await axios.get(TOKEN_LIST_URL);
    const tokenMetadata = response.data.find((token: any) => token.symbol === ticker);

    if (tokenMetadata === undefined) {
      return "error";
    } else {
      return tokenMetadata;
    }
  } catch (error) {
    return "error";
  }
};

export const fetchSwapDetails = async (fromMetaData: any, amount: number, toMetaData: any) => {
  try {
    const injectiveMainnetChainId = "injective-1";

    const res = await fetch(
      `https://swap.coinhall.org/v1/swap?chainId=${injectiveMainnetChainId}&from=${checkErc20(
        fromMetaData
      )}&to=${checkErc20(toMetaData)}&amount=${
        amount * 10 ** fromMetaData.decimals
      }&slippageBps=500`
    );
    const { expectedReturn, minimumReceive, contractInput, route } = await res.json();

    if (minimumReceive === undefined) {
      const msg = "error_min";
      return { msg: msg, contract_input: "" };
    }
    const msg = `Route: ${
      route[0].dex
    } | Amount: ${amount} ${fromMetaData.symbol.toUpperCase()} = ${
      Number(minimumReceive) / 10 ** toMetaData.decimals
    } ${toMetaData.symbol}`;

    return { msg: msg, contract_input: contractInput };
  } catch (error) {
    const msg = `❌ Failed to fetch routes.`;
    return { msg: msg, contract_input: "" };
  }
};

function checkErc20(metadata: any) {
  if (metadata.tokenType == "erc20") {
    return metadata.denom;
  } else {
    return metadata.address;
  }
}

export async function validateTokens(from: string, to: string) {
  try {
    const response = await axios.get("https://api.injective.exchange/api/spot/v1/markets");
    const markets = response.data.markets;

    const validFrom = markets.some((market: any) => market.baseDenom.toUpperCase() === from);
    const validTo = markets.some((market: any) => market.quoteDenom.toUpperCase() === to);

    return validFrom && validTo;
  } catch (error) {
    return false;
  }
}
