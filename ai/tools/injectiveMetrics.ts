import axios from "axios";

interface InjectiveData {
  tvl: number;
  protocols: Protocol[];
}

interface Protocol {
  name: string;
  logo: string;
  category: string;
  methodology: string;
  tvl: number;
}

export const fetchTopInjectiveProtocols = async (): Promise<Protocol[]|null> => {
  try {
    const response = await axios.get("https://api.llama.fi/protocols");
    const protocols = response.data;

    const injectiveProtocols: Protocol[] = protocols
      .filter((protocol: any) => protocol.chains.includes("Injective"))
      .map((protocol: any) => ({
        name: protocol.name,
        logo: protocol.logo,
        category: protocol.category,
        methodology: protocol.methodology,
        tvl: protocol.chainTvls?.Injective ?? 0, 
      }))
      .filter((protocol: { tvl: number; }) => protocol.tvl > 0);

    injectiveProtocols.sort((a, b) => b.tvl - a.tvl);

    const top10Protocols = injectiveProtocols.slice(0, 10);

    const remainingTvl = injectiveProtocols
      .slice(10) 
      .reduce((sum, protocol) => sum + protocol.tvl, 0);

    if (remainingTvl > 0) {
      top10Protocols.push({
        name: "Others",
        logo: "",
        category: "Aggregated",
        methodology: "Summed TVL of protocols outside top 10",
        tvl: remainingTvl,
      });
    }
    return top10Protocols;
  } catch (error) {
    console.error("Error fetching Injective protocols:", error);
    return null;
  }
};




export const fetchInjectiveData = async (): Promise<InjectiveData | null> => {
  try {

    const response = await axios.get("https://api.llama.fi/chains");
    const chainsData = response.data;
    
    const injectiveData = chainsData.find(
      (chain: any) => chain.name.toLowerCase() === "injective"
    );

    if (!injectiveData) {
      throw new Error("Injective chain data not found");
    }

    const protocols = await fetchTopInjectiveProtocols()

    if(protocols == null){
      return null
    }

    const tvl = injectiveData.tvl;
   
    const data = {
        tvl,
        protocols,
      };
    return data;
  } catch (error) {
    console.error("Error fetching Injective data:", error);
    return null;
  }
};


