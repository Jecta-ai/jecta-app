

import { createChatMessage } from '@/app/utils';
import { soniaRouter } from '../sonia';
import { fetchTokenPriceDirectly } from '../tools/fetchTokenPrice';
import { dojoBurnAddress, fetchTokenMetadata, fetchVault, findLiquidityPools, generateWalletTableHTML, getCW20TokenInfo, getFactoryTokenInfo, getPieChartData, getServerSideProps, getTokenFromMessage, INJ_CW20_ADAPTER, injBurnAddress, mitoFinance } from '../tools/tokenTools';

  
  export async function tokenAnalysis(
    intent: string,
    message: string,
    chatHistory: any[],
    addToChat: (msg: any) => void,
    address: string | null) {
      addToChat(
        createChatMessage({
          sender: "ai",
          text:"Calling Sonia for the token analysis...",
          type: "text",
          intent:intent
        })
        );
  
      let token = getTokenFromMessage(message);
            if (!token) {
              addToChat(
                createChatMessage({
                  sender: "sonia",
                  text: "❌ Token couldn't be found. Please write the ticker as INJ or ATOM.",
                  type: "error",
                  intent:intent
                })
                );
              return;
            }
      const tokenPrice = await fetchTokenPriceDirectly(token);
      

      const tokencontract = await fetchTokenMetadata(token);
      if(!tokencontract){
        addToChat(
          createChatMessage({
                  sender: "sonia",
                  text: "❌ This token is not available on Injective Metadata list. Please try another one.",
                  type: "error",
                  intent:intent
                })
              );
        return
      }
      
      const address1 = tokencontract.address;
      const address2 = `factory/${INJ_CW20_ADAPTER}/${tokencontract.address}`
      
      
      const holders = await getServerSideProps(address1,address2)

      if(holders.props.tokenHolders.data.holders.length == 0){
        addToChat(
          createChatMessage({
            sender: "sonia",
            text: "❌ This token is not available on Trippytools. Please try another one or contact with trippy team to whitelist this token.",
            type: "error",
            intent:intent
          })
          );
        return
      }

      let tokenInfo;
      let tokenMetadata;
      let supply;

      let contract_pools;
      if(tokencontract.tokenType == "cw20"){
        const contractPools = await findLiquidityPools(address1)
        contract_pools = contractPools
        tokenInfo = await getCW20TokenInfo(tokencontract.address)
        supply = Number(tokenInfo.total_supply)/10**tokenInfo.decimals
         tokenMetadata = {
          name: tokencontract.name,
          symbol: tokencontract.symbol,
          contract:tokencontract.address,
          price:tokenPrice?tokenPrice:"N/A",
          supply:supply ,
          decimals: tokenInfo.decimals,
          logo: tokencontract.logo,
          token_type: tokencontract.tokenType,
          holder_amount:holders.props.tokenHolders.data.holders.length,
          
        }
      }else if(tokencontract.tokenType == "tokenFactory"){
        
        tokenInfo = await getFactoryTokenInfo(tokencontract.address)
        supply = Number(tokenInfo?.supply)/10**tokencontract.decimals
        contract_pools=null
        tokenMetadata = {
          name: tokencontract.name,
          symbol: tokencontract.symbol,
          contract:tokencontract.address,
          price:tokenPrice?tokenPrice:"N/A",
          supply: supply,
          decimals: tokencontract.decimals,
          logo: tokencontract.logo,
          token_type: tokencontract.tokenType,
          holder_amount:holders.props.tokenHolders.data.holders.length,
          
        }
      }else{
        addToChat(
          createChatMessage({
            sender: "sonia",
            text: "❌ Token type is not supported for the analysis.",
            type: "error",
            intent:intent
          })
        );
        return;
      }

      let availableVaults;
      
      if(tokencontract.marketIds || tokencontract.marketId){
        
        const vaults = await fetchVault()
        
        const filteredVaults = vaults.filter((vault: any) => ((tokencontract.marketIds.includes(vault.marketId))||(tokencontract.marketIds.includes(vault.marketId))));
        if(filteredVaults.length == 0){
          availableVaults == null;
        }else{
          const vaultsFinal = filteredVaults.map((vault:any) => ({
            vaultName: vault.vaultName,
            marketId: vault.marketId,
            currentTvl: vault.currentTvl,
            contractAddress: vault.contractAddress,
            apy: vault.apy,
          }));
          availableVaults = vaultsFinal;
        }
      }
     
      const pieChartData = await getPieChartData(holders.props.tokenHolders.data.holders,supply)
      const topHolders = generateWalletTableHTML(pieChartData.topHolders,availableVaults,contract_pools)
      
      addToChat(
        createChatMessage({
          sender: "sonia",
          text:`Analyzing token ${tokenMetadata.symbol}...`,
          type: "text",
          intent:intent
        })
     );
      addToChat(
        createChatMessage({
          sender: "sonia",
          token_metadata:tokenMetadata,
          type: "tokenmetadata",
          intent:intent
        })
        );
      addToChat(
        createChatMessage({
          sender: "sonia",
          text:`Fetching top holders with Trippy Holders Tool...`,
          
          type: "text",
          intent:intent
        })
        );
      addToChat(
        createChatMessage({
          sender: "sonia",
          text:topHolders,
          type: "text",
          intent:intent
        })
        );
      addToChat(
        createChatMessage({
          sender: "sonia",
          text:`Here is a pie chart including top holders and others.`,
          type: "text",
          intent:intent
        })
        );
      addToChat(
        createChatMessage({
          sender: "sonia",
          pie:pieChartData.chartData,
          type: "pie",
          intent:intent
        })
        );


      addToChat(
        createChatMessage({
          sender: "sonia",
          text:`Finding the current pools from DojoSwap & Astroport...`,
          type: "text",
          intent:intent
        })
        );
      if(contract_pools == null){
        addToChat(
          createChatMessage({
            sender: "sonia",
            text:`No pools found on DojoSwap & Astroport...`,
            type: "text",
            intent:intent
          })
         );
      }else{
        const pools = `
          <div class="bg-black text-white p-6 rounded-lg shadow-lg border-2 border-green-500">
            <h2 class="text-2xl font-bold text-green-400 mb-4 text-center">⚡ Liquidity Pools ⚡</h2>
            <div class="space-y-4">
              ${contract_pools.map(item => {
                const assetEntries = Object.entries(item.assets).map(([token, amount]) => `
                  <p class="text-sm text-gray-300">${token}: <span class="text-green-300">${amount}</span></p>
                `).join('');

                return `
                  <div class="p-4 border border-green-500 rounded-lg bg-gray-900 hover:shadow-green-500 hover:shadow-md transition">
                    <h3 class="text-xl font-semibold text-green-300">${item.platform}</h3>
                    <p class="text-sm text-gray-400">Contract: <span class="text-green-200">${item.contractAddress}</span></p>
                    <p class="text-sm text-gray-300">Pair: <span class="text-green-400">${item.pair}</span></p>
                    <div class="mt-2">${assetEntries}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
        addToChat(
          createChatMessage({
            sender: "sonia",
            text:pools,
            type: "text",
            intent:intent
          })
        );
      }
      addToChat(
        createChatMessage({
          sender: "sonia",
          text:`Finding the current pools from Mito...`,
          type: "text",
          intent:intent
        })
       );
      if(availableVaults == null){
        addToChat(
          createChatMessage({
            sender: "sonia",
            text:`No pools found on Mito...`,
            type: "text",
            intent:intent
          })
         );
      }else{
        const pools = `
          <div class="bg-black text-white p-6 rounded-lg shadow-lg border-2 border-blue-500">
            <h2 class="text-2xl font-bold text-blue-400 mb-4 text-center">⚡ Mito Vaults ⚡</h2>
            <div class="space-y-4">
              ${availableVaults.map((vault:any) => `
                <div class="p-4 border border-blue-500 rounded-lg bg-gray-900 hover:shadow-blue-500 hover:shadow-md transition">
                  <h3 class="text-xl font-semibold text-blue-300">${vault.vaultName}</h3>
                  <p class="text-sm text-gray-400">Contract: <span class="text-blue-200">${vault.contractAddress}</span></p>
                  <p class="text-sm text-gray-300">TVL: <span class="text-green-400">${vault.currentTvl.toLocaleString()}</span></p>
                  <p class="text-sm text-gray-300">APY: <span class="${vault.apy < 0 ? 'text-red-400' : 'text-green-400'}">${vault.apy.toFixed(2)}%</span></p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        addToChat(
          createChatMessage({
            sender: "sonia",
            text:pools,
            type: "text",
            intent:intent
          })
         );

      }
      addToChat(
        createChatMessage({
          sender: "sonia",
          text:"Let me analyze the datas and give you an idea...",
          type: "text",
          intent:intent
        })
        );

      const soniaResponse = await soniaRouter(tokenMetadata,pieChartData.topHolders,INJ_CW20_ADAPTER,dojoBurnAddress,injBurnAddress,mitoFinance,availableVaults,contract_pools)
      addToChat(
        createChatMessage({
          sender: "sonia",
          text:soniaResponse,
          type: "text",
          intent:intent
        })
       );
  }

  