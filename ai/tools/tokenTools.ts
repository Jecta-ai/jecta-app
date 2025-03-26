import axios from "axios";
import { ChainGrpcBankApi, ChainGrpcWasmApi } from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const endpoints = getNetworkEndpoints(Network.Mainnet);

const grpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc);
const grpcBankApi = new ChainGrpcBankApi(endpoints.grpc);

export const INJ_CW20_ADAPTER = "inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk";
export const dojoBurnAddress = "inj1wu0cs0zl38pfss54df6t7hq82k3lgmcdex2uwn";
export const injBurnAddress = "inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49";
export const mitoFinance = "inj14vnmw2wee3xtrsqfvpcqg35jg9v7j2vdpzx0kk";

import { IndexerGrpcSpotApi, IndexerGrpcMitoApi } from "@injectivelabs/sdk-ts";
import { Buffer } from "buffer";

const wasmApi = new ChainGrpcWasmApi(endpoints.grpc);
const MITO_API_ENDPOINT = "https://k8s.mainnet.mito.grpc-web.injective.network";
const mitoApi = new IndexerGrpcMitoApi(MITO_API_ENDPOINT);

const FACTORIES = [
  { name: "DojoSwap", address: "inj1pc2vxcmnyzawnwkf03n2ggvt997avtuwagqngk" },
  { name: "Astroport", address: "inj19aenkaj6qhymmt746av8ck4r8euthq3zmxr2r6" },
];

const baseUrl = "https://app.jectadotai.com";

export async function findLiquidityPools(contract: string) {
  const dojopool = await fetchPools("DojoSwap", contract);
  const astropools = await fetchPools("Astroport", contract);

  if (dojopool && astropools) {
    const dojopoolinfo = await getPoolInfo(dojopool.contract_addr);
    const dojopair = await formatPair(dojopool.asset_infos);
    const dojopairamounts = await formatPoolAmounts(dojopoolinfo.assets);
    const astropoolinfo = await getPoolInfo(astropools.contract_addr);
    const astropair = await formatPair(astropools.asset_infos);
    const astropairamounts = await formatPoolAmounts(astropoolinfo.assets);
    const poolsData = [
      {
        platform: "DojoSwap",
        contractAddress: dojopool.contract_addr,
        pair: dojopair,
        assets: dojopairamounts,
      },
      {
        platform: "Astroport",
        contractAddress: astropools.contract_addr,
        pair: astropair,
        assets: astropairamounts,
      },
    ];
    return poolsData;
  } else if (astropools && !dojopool) {
    const astropoolinfo = await getPoolInfo(astropools.contract_addr);
    const astropair = await formatPair(astropools.asset_infos);
    const astropairamounts = await formatPoolAmounts(astropoolinfo.assets);
    const poolsData = [
      {
        platform: "Astroport",
        contractAddress: astropools.contract_addr,
        pair: astropair,
        assets: astropairamounts,
      },
    ];
    return poolsData;
  } else if (!astropools && dojopool) {
    const dojopoolinfo = await getPoolInfo(dojopool.contract_addr);
    const dojopair = await formatPair(dojopool.asset_infos);
    const dojopairamounts = await formatPoolAmounts(dojopoolinfo.assets);
    const poolsData = [
      {
        platform: "DojoSwap",
        contractAddress: dojopool.contract_addr,
        pair: dojopair,
        assets: dojopairamounts,
      },
    ];
    return poolsData;
  } else {
    return null;
  }
}

async function getTokenMetadata(tokenAddress: string) {
  try {
    const query = Buffer.from(JSON.stringify({ token_info: {} })).toString("base64");
    const response = await wasmApi.fetchSmartContractState(tokenAddress, query);
    const metadata = JSON.parse(new TextDecoder().decode(response.data));
    return { symbol: metadata.symbol, decimals: metadata.decimals };
  } catch (error) {
    console.error(`⚠️ Error fetching metadata for ${tokenAddress}:`, error);
    return null;
  }
}

async function formatPoolAmounts(poolAssets: any[]) {
  let tokenAmounts: Record<string, string> = {};

  for (let i = 0; i < poolAssets.length; i++) {
    const asset = poolAssets[i];

    let decimals;
    let symbol = "";
    if (asset.info.token) {
      const metadata = await getTokenMetadata(asset.info.token.contract_addr);
      symbol = metadata?.symbol;
      decimals = metadata?.decimals;
    } else if (asset.info.native_token) {
      symbol = asset.info.native_token.denom.toUpperCase();
      decimals = 18;
    }

    const formattedAmount = (Number(asset.amount) / Number(10 ** decimals)).toString();

    tokenAmounts[symbol] = formattedAmount;
  }

  return tokenAmounts;
}
export async function fetchVault() {
  const limit = 100;
  let pageIndex = 0;
  let totalVaults: any = [];
  let total: Number = 0;

  do {
    const response = await mitoApi.fetchVaults({
      limit: limit,
      pageIndex: pageIndex,
    });

    if (!response.vaults || response.vaults.length === 0 || !response.pagination) {
      break;
    }

    totalVaults = totalVaults.concat(response.vaults);
    total = response.pagination.total;
    pageIndex += 1;
  } while (totalVaults.length < total);
  return totalVaults;
}

async function formatPair(assetInfos: any[]): Promise<string> {
  const symbols = await Promise.all(
    assetInfos.map(async (asset) => {
      if (asset.token) {
        const metadata = await getTokenMetadata(asset.token.contract_addr);
        return metadata?.symbol;
      }
      return asset.native_token?.denom.toUpperCase();
    })
  );

  return `${symbols[0]}/${symbols[1]}`;
}
async function getPoolInfo(pairAddress: string) {
  const query = Buffer.from(JSON.stringify({ pool: {} })).toString("base64");
  const response = await wasmApi.fetchSmartContractState(pairAddress, query);
  return JSON.parse(new TextDecoder().decode(response.data));
}

async function fetchPools(factoryName: string, contract: string) {
  const factory = FACTORIES.find((f) => f.name === factoryName);
  if (!factory || !contract) {
    console.error(
      `⚠️ Invalid factory or contract address. Factory: ${factory?.address}, Contract: ${contract}`
    );
    return null;
  }

  const baseAssets = [{ native_token: { denom: "inj" } }, { token: { contract_addr: contract } }];

  const queries = baseAssets.map((baseAsset) => {
    const query = {
      pair: { asset_infos: [baseAsset, { token: { contract_addr: contract } }] },
    };
    const queryBase64 = Buffer.from(JSON.stringify(query)).toString("base64");
    return wasmApi.fetchSmartContractState(factory.address, queryBase64);
  });

  const results = await Promise.allSettled(queries);

  for (const result of results) {
    if (result.status === "fulfilled" && result.value?.data) {
      return JSON.parse(new TextDecoder().decode(result.value.data));
    }
  }

  return null;
}

type Holder = {
  wallet_id: string;
  balance: number;
  percentage_held: number;
  token_id: string;
  id: number;
};

type PieChartData = {
  label: string;
  value: number;
};

export async function getCW20TokenInfo(contract: string) {
  try {
    const tokenInfo = await grpcWasmApi.fetchSmartContractState(
      contract,
      Buffer.from(JSON.stringify({ token_info: {} })).toString("base64")
    );
    const decodedData = JSON.parse(Buffer.from(tokenInfo.data).toString());
    return decodedData;
  } catch (error) {
    console.error("Error fetching CW20 token info:", error);
  }
}
export async function getFactoryTokenSupply(contract: string): Promise<string | null> {
  try {
    let nextPageKey: string | null = null;

    while (true) {
      let supplyResponse;
      if (!nextPageKey) {
        supplyResponse = await grpcBankApi.fetchTotalSupply({
          key: undefined,
          limit: 100,
          countTotal: true,
        });
      } else {
        supplyResponse = await grpcBankApi.fetchTotalSupply({
          key: nextPageKey,
          limit: 100,
          countTotal: true,
        });
      }

      const tokenSupply = supplyResponse.supply.find((coin) => coin.denom === contract);
      if (tokenSupply) {
        return tokenSupply.amount;
      }

      if (!supplyResponse) {
        break;
      }
      nextPageKey = supplyResponse.pagination.next;
    }
    return null;
  } catch (error) {
    console.error("Error fetching token supply:", error);
    return null;
  }
}

export async function getFactoryTokenInfo(contract: string) {
  try {
    const tokenMetadata = await grpcBankApi.fetchDenomMetadata(contract);
    const supply = await getFactoryTokenSupply(contract);
    return { tokenMetadata, supply };
  } catch (error) {
    console.error("Error fetching factory token info:", error);
  }
}

export async function getPieChartData(data: Holder[], total_supply: number): Promise<any> {
  if (!data || data.length === 0 || total_supply <= 0) return [];

  const calculatedData = data.map((holder) => ({
    ...holder,
    percentage_held: (holder.balance / total_supply) * 100,
  }));

  const sortedData = [...calculatedData].sort((a, b) => b.percentage_held - a.percentage_held);
  const topHolders = sortedData.slice(0, 10);
  const othersPercentage = sortedData
    .slice(10)
    .reduce((sum, holder) => sum + holder.percentage_held, 0);

  const chartData: PieChartData[] = topHolders.map((holder) => ({
    label: holder.wallet_id,
    value: parseFloat(holder.percentage_held.toFixed(2)),
  }));

  if (sortedData.length > 10) {
    chartData.push({
      label: "Others",
      value: parseFloat(othersPercentage.toFixed(2)),
    });
  }

  return { chartData, topHolders };
}

export async function getServerSideProps(address1: string, address2: string) {
  const apiUrl = `${baseUrl}/api/tokenHolders`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        addresses: [address1, address2],
        balanceMin: 1,
      }),
    });

    if (!response.ok) {
      console.error("API Request Failed:", response.status);
      return { props: { error: "Failed to fetch token holders" } };
    }

    const data = await response.json();
    return { props: { tokenHolders: data } };
  } catch (error) {
    console.error("Unexpected Error:", error);
    return { props: { error: "Internal Server Error" } };
  }
}
export const generateWalletTableHTML = (data: any[], mitoVaults: any, normalPools: any) => {
  const INJ_CW20_ADAPTER = "inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk";
  const dojoBurnAddress = "inj1wu0cs0zl38pfss54df6t7hq82k3lgmcdex2uwn";
  const injBurnAddress = "inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49";
  const mitoFinance = "inj14vnmw2wee3xtrsqfvpcqg35jg9v7j2vdpzx0kk";
  const mitoVaultAddresses = mitoVaults
    ? mitoVaults.map((vault: any) => vault.contractAddress)
    : [];

  const normalPoolAddresses = normalPools
    ? normalPools.map((pool: any) => pool.contractAddress)
    : [];

  const getLabel = (walletId: string) => {
    if (walletId === INJ_CW20_ADAPTER) return "INJ CW20 Adapter";
    if (walletId === dojoBurnAddress) return "Dojo Burn Address";
    if (walletId === injBurnAddress) return "INJ Burn Address";
    if (walletId === mitoFinance) return "Mito Finance";
    if (mitoVaultAddresses.includes(walletId)) return "Mito Vault";
    if (normalPoolAddresses.includes(walletId)) return "LP";
    return "";
  };

  return `
           <div style="padding: 16px; border-radius: 10px; background: linear-gradient(to right, #1e3a8a, #2563eb, #3b82f6); color: white; font-family: Arial, sans-serif; box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.2);">
              <h2 style="text-align: center; font-size: 18px; margin-bottom: 12px; color: #bfdbfe;">Wallet Holdings</h2>
              <div style="overflow-x: auto;">
                <table style="width: 100%; min-width: 600px; border-collapse: collapse;">
                  <thead>
                    <tr style="background: #1e3a8a; color: #bfdbfe; text-align: left;">
                      <th style="padding: 8px; border-bottom: 2px solid #60a5fa;">Wallet ID</th>
                      <th style="padding: 8px; border-bottom: 2px solid #60a5fa;">Label</th>
                      <th style="padding: 8px; border-bottom: 2px solid #60a5fa;">Balance</th>
                      <th style="padding: 8px; border-bottom: 2px solid #60a5fa;">Percentage Held</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${data
                      .map((item) => {
                        const label = getLabel(item.wallet_id);
                        return `
                          <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #3b82f6; color: #dbeafe;">
                              ${item.wallet_id}
                            </td>
                            <td style="padding: 8px; border-bottom: 1px solid #3b82f6; font-weight: bold; color: ${
                              label ? "#60a5fa" : "#bfdbfe"
                            };">
                              ${label ? label : "—"}
                            </td>
                            <td style="padding: 8px; border-bottom: 1px solid #3b82f6; font-weight: bold; color: #60a5fa;">
                              ${item.balance.toLocaleString()}
                            </td>
                            <td style="padding: 8px; border-bottom: 1px solid #3b82f6; color: #93c5fd;">
                              ${item.percentage_held.toFixed(2)}%
                            </td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            </div>


    `;
};

const TOKEN_LIST_URL =
  "https://raw.githubusercontent.com/InjectiveLabs/injective-lists/refs/heads/master/json/tokens/mainnet.json";

export const fetchTokenMetadata = async (ticker: string) => {
  try {
    const response = await axios.get(TOKEN_LIST_URL);
    const tokenMetadata = response.data.find(
      (token: any) =>
        token.symbol === ticker &&
        (token.tokenType === "cw20" || token.tokenType === "tokenFactory")
    );

    if (tokenMetadata) {
      return tokenMetadata;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getTokenFromMessage = (userMessage: string) => {
  const tokenRegex = /\b([A-Z]{2,10})\b/;
  const match = userMessage.match(tokenRegex);
  return match ? match[1] : null;
};
