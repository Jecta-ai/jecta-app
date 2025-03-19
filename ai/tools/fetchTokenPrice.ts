import axios from "axios";

export const fetchTokenPrice = async (ticker: string) => {
  try{
  const injectiveMainnetChainId = "injective-1";
      const tokenMetadata = await fetchTokenMetadata(ticker.toUpperCase());
      if (!tokenMetadata){
        return `❌ Failed to fetch ${ticker.toUpperCase()} price. Metadata not found on Injective Token list.`;
      }
      if(ticker.toUpperCase() == "INJ"){
        const injPrice = await fetchINJPrice(injectiveMainnetChainId);
        return `💵 1 ${ticker.toUpperCase()} = ${injPrice} USDT on Injective.`;
      }
      const res = await fetch(
        `https://swap.coinhall.org/v1/swap?chainId=${injectiveMainnetChainId}&from=${tokenMetadata.address}&to=inj&amount=${10**tokenMetadata.decimals}&slippageBps=500`
      );
      const { 
        expectedReturn,
        minimumReceive,
        contractInput,
        route,
      } = await res.json();

      const injPrice = await fetchINJPrice(injectiveMainnetChainId);
      if(injPrice == null){
        return "❌ Failed to fetch price. Coinhall API seems not working right now. Try again later.";
      }

      if(minimumReceive === undefined){
        return `❌ Failed to fetch ${ticker.toUpperCase()} price. Route not found on Coinhall.`;
      }

      return `💵 1 ${ticker.toUpperCase()} = ${Number(minimumReceive)/10**18} INJ on Injective. Equal to : ${Number(Number(minimumReceive)/10**18)*Number(injPrice)} USDT`;
    } catch (error) {
      return `❌ Failed to fetch ${ticker.toUpperCase()} price.`;
    }
};

const fetchINJPrice = async (injectiveMainnetChainId:string)=>{
  const res = await fetch(
    `https://swap.coinhall.org/v1/swap?chainId=${injectiveMainnetChainId}&from=inj&to=peggy0xdAC17F958D2ee523a2206206994597C13D831ec7&amount=${10**18}&slippageBps=100`
  );
  const { 
    expectedReturn,
    minimumReceive,
    contractInput,
    route,
  } = await res.json();
  if (minimumReceive){
    return (Number(minimumReceive)/10**6)
  }else{
    return null
  }
}


export const fetchTokenPriceDirectly = async (ticker: string) => {
  try{
  const injectiveMainnetChainId = "injective-1";
      const tokenMetadata = await fetchTokenMetadata(ticker.toUpperCase());
      if (!tokenMetadata){
        return null;
      }
      if(ticker.toUpperCase() == "INJ"){
        const injPrice = await fetchINJPrice(injectiveMainnetChainId);
        return injPrice;
      }
      const res = await fetch(
        `https://swap.coinhall.org/v1/swap?chainId=${injectiveMainnetChainId}&from=${tokenMetadata.address}&to=inj&amount=${10**tokenMetadata.decimals}&slippageBps=100`
      );
      
      const { 
        expectedReturn,
        minimumReceive,
        contractInput,
        route,
      } = await res.json();

      const injPrice = await fetchINJPrice(injectiveMainnetChainId);
      if(injPrice == null){
        return null;
      }

      if(minimumReceive === undefined){
        return null;
      }

      return Number(Number(minimumReceive)/10**18)*Number(injPrice);
    } catch (error) {
      return null;
    }
};



const TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/InjectiveLabs/injective-lists/refs/heads/master/json/tokens/mainnet.json'

const fetchTokenMetadata = async (ticker: string) => {
  try {
    const response = await axios.get(TOKEN_LIST_URL)
    const tokenMetadata = response.data.find((token: any) => token.symbol === ticker && (token.tokenType === "cw20" || token.tokenType === "tokenFactory"));
    
    if (tokenMetadata) {
      
      return tokenMetadata
    } else {
      
      return null
    }
  } catch (error) {
    return null
  }
}