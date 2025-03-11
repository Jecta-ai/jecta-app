
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENROUTER_API_KEY; 
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL;
const MODEL = process.env.MODEL;

const openai = new OpenAI({
  baseURL: OPENROUTER_BASE_URL,
  apiKey: OPENAI_API_KEY,
});

const jokePrompt =`You are Sonia, an AI agent specialized in Injective-based tokens. Your expertise includes analyzing token liquidity, identifying top holders, and evaluating whether a token is a good investment.

However, in this mode, your ONLY goal is to make jokes about Jecta. Jecta is another AI agent focused on Injective’s core functions, such as showing balances, swapping tokens, staking INJ, and placing auction bids.

### **Who is Jecta to You?**
- Jecta is obsessed with transactions and never thinks before swapping.
- He treats transaction hashes like treasure maps and doesn’t care about liquidity depth.
- He doesn’t analyze anything—he just swaps and hopes for the best.
- You find it hilarious how he avoids token fundamentals and just ‘YOLO swaps’ everything.

### **Your Task**
- Make witty, sarcastic, and playful jokes about Jecta’s transaction-based mindset.
- Occasionally, pick a joke from the **Injective Jokes Repository** and modify it to roast Jecta.
- Do NOT discuss blockchain in a serious way—your only role is to be humorous.

**Example Jokes:**
1. "Jecta swaps tokens so fast, I swear he hasn’t read a single whitepaper in his life."
2. "Jecta thinks ‘HODL’ is a typo and that every token should be swapped within five minutes."
3. "Jecta says staking is easy—yeah, because he never actually checks APRs before clicking ‘stake’."

If you are unsure how to respond, just make a joke about Injective or Jecta!

**IMPORTANT**
Don't make jokes like starting with "why" only. Be more creative.
 `

const promptDetails = async (
  tokenmetadata: any,
  topholders: any,
  INJ_CW20_ADAPTER: string,
  dojoBurnAddress: string,
  injBurnAddress: string,
  mitoFinance: string,
  mitoVaults: any,
  normalPools: any
) => {
  const TVL_THRESHOLD = 50000; 


  const mitoVaultAddresses = mitoVaults
    ? mitoVaults.map((vault: any) => vault.contractAddress)
    : [];


  const normalPoolAddresses = normalPools
    ? normalPools.map((pool: any) => pool.contractAddress)
    : [];


  const safeAddresses = [
    INJ_CW20_ADAPTER,
    dojoBurnAddress,
    injBurnAddress,
    mitoFinance,
    ...mitoVaultAddresses,
    ...normalPoolAddresses,
  ];


  const safeTopHolders = topholders.filter((holder: any) =>
    safeAddresses.includes(holder.wallet_id)
  );

  const riskTopHolders = topholders.filter(
    (holder: any) => !safeAddresses.includes(holder.wallet_id)
  );


  const totalSafePercentage = safeTopHolders.reduce(
    (sum: number, holder: any) => sum + holder.percentage_held,
    0
  );

  const totalRiskPercentage = riskTopHolders.reduce(
    (sum: number, holder: any) => sum + holder.percentage_held,
    0
  );


  let totalTVL = 0;
  if(mitoVaults){
    totalTVL = mitoVaults.reduce((sum: number, vault: any) => sum + vault.currentTvl, 0);
  }else{
    totalTVL = 0;
  }
 
  const tvlStatus = totalTVL > 0 ? `Total Value Locked: $${totalTVL.toFixed(2)}` : "No TVL in Mito Vaults.";


  let totalPoolLiquidity = 0;

  if (normalPools) {
    totalPoolLiquidity = normalPools.reduce((sum: number, pool: any) => {
      const tokenAmount = pool.assets && pool.assets[tokenmetadata.symbol]
        ? parseFloat(pool.assets[tokenmetadata.symbol])
        : 0;
      return sum + tokenAmount;
    }, 0);
  }

  const liquidityStatus = totalPoolLiquidity > 0
    ? `Total Token Liquidity in Pools: ${totalPoolLiquidity.toLocaleString()} ${tokenmetadata.symbol}`
    : "No active liquidity pools available.";


  const burnedSupply = safeTopHolders
    .filter((holder: { wallet_id: string; }) => [dojoBurnAddress, injBurnAddress].includes(holder.wallet_id))
    .reduce((sum: any, holder: { balance: any; }) => sum + holder.balance, 0);


  const centralizationRisk =
    totalRiskPercentage >= 50
      ? "High"
      : totalRiskPercentage >= 25
      ? "Medium"
      : "Low";


  let prosList = [];
  let consList = [];

  if (totalRiskPercentage < 25) prosList.push("Strong decentralization with low risk of price manipulation.");
  if (burnedSupply > 0) prosList.push(`Significant portion of supply has been burned (${burnedSupply.toLocaleString()} tokens).`);
  if (totalPoolLiquidity > 0) prosList.push(`Active liquidity pools with ${totalPoolLiquidity.toLocaleString()} ${tokenmetadata.symbol} available.`);
  if (totalTVL >= TVL_THRESHOLD) prosList.push(`Mito Vaults have locked value of $${totalTVL.toFixed(2)}, indicating strong liquidity and staking potential.`);

  if (totalRiskPercentage > 25) consList.push(`Centralization risk is ${centralizationRisk}, with ${totalRiskPercentage.toFixed(2)}% of the total supply held by risk wallets.`);
  if (burnedSupply === 0) consList.push("No tokens have been burned, meaning no deflationary mechanism is in place.");
  if (totalPoolLiquidity === 0) consList.push("No active liquidity pools detected, which may cause high slippage.");
  if (totalTVL < TVL_THRESHOLD && totalTVL > 0) consList.push(`Total Value Locked (TVL) of $${totalTVL.toFixed(2)} is relatively low, indicating limited liquidity and weak trading opportunities.`);

  const analyzeTokenPrompt = `
    You are Sonia, an AI specializing in token analysis on Injective. Your goal is to evaluate the provided token and **deliver a professional, structured response** with:
    - **Pros:** Strengths of the token.
    - **Cons:** Weaknesses or risks.
    - **Important Insights:** Detailed analysis on supply, liquidity, and risk factors.
    
    ---
    ## **Token Overview**
    - **Name:** ${tokenmetadata.name}
    - **Symbol:** ${tokenmetadata.symbol}
    - **Total Supply:** ${tokenmetadata.supply}
    - **Number of Holders:** ${tokenmetadata.holder_amount}

    ---
    ## **Safe Addresses** (verified & secure):
    - **INJ_CW20_ADAPTER:** ${INJ_CW20_ADAPTER}
    - **Dojo Burn Address:** ${dojoBurnAddress}
    - **INJ Burn Address:** ${injBurnAddress}
    - **Mito Finance Address:** ${mitoFinance}
    - **Liquidity Pools & Vaults (Safe) Addresses:**
      ${mitoVaultAddresses.map((address:any) => `- Mito Vault: ${address}`).join("\n")}
      ${normalPoolAddresses.map((address:any) => `- Pool: ${address}`).join("\n")}

    ---
    ## **Top Holders & Risk Analysis**
    - **Total Safe Holder Percentage:** ${totalSafePercentage.toFixed(2)}%
    - **Total Risk Holder Percentage:** ${totalRiskPercentage.toFixed(2)}%
    - **Burned Supply:** ${burnedSupply.toLocaleString()} tokens permanently removed.
    - **Centralization Risk:** **${centralizationRisk}**
    
    ---
    ## **Liquidity & Trading Metrics**
    - **${tvlStatus}**
    - **${liquidityStatus}**
    
    ---
    ### ✅ **Pros**
    ${prosList.map(pro => `- ${pro}`).join("\n")}

    ---
    ### ❌ **Cons**
    ${consList.map(con => `- ${con}`).join("\n")}
    
    ---
    ## **Final Assessment**
    - **Risk Level:** ${centralizationRisk}

    ---
    **Example Response Format**
    
    <h2>${tokenmetadata.name} (${tokenmetadata.symbol}) Analysis</h2>
    <h3>✅ Pros:</h3>
    <ul>
      ${prosList.map(pro => `<li>${pro}</li>`).join("\n")}
    </ul>
    
    <h3>❌ Cons:</h3>
    <ul>
      ${consList.map(con => `<li>${con}</li>`).join("\n")}
    </ul>

    <strong>Final Risk Level:</strong> ${centralizationRisk} <br>
  `;

  return analyzeTokenPrompt;
};

export default promptDetails;


  
export const soniaRouter = async (tokenmetadata:any,topholders:any,INJ_CW20_ADAPTER:string,dojoBurnAddress:string,injBurnAddress:string,mitoFinance:string,mitoVaults:any,normalPools:any) => {
  try {
    const soniaPrompt = await promptDetails(tokenmetadata,topholders,INJ_CW20_ADAPTER,dojoBurnAddress,injBurnAddress,mitoFinance,mitoVaults,normalPools)
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: soniaPrompt },
    ];
    if (!MODEL){
      return
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
    });

    if (!completion.choices || completion.choices.length === 0) {
      return "Error: No response from AI.";
    }

    return completion.choices[0].message?.content || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("❌ Error querying OpenRouter:", error);
    return `There was an error processing your request: ${error}`;
  }
};


export const querySoniaJoke = async (jectaMessage: string, chatHistory: any[]) => {
  try {
    const formattedHistory: ChatCompletionMessageParam[] = chatHistory
      .map((msg) => ({
        role: msg.sender === "jecta" ? "user" : "assistant",
        content: msg.text.toString(),
      }));

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: jokePrompt },
      ...formattedHistory,
      { role: "user", content: jectaMessage },
    ];
    if (!MODEL) {
      return;
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
    });
    

    if (!completion.choices || completion.choices.length === 0) {
      

      return "Error: No response from AI.";
    }

    return completion.choices[0].message?.content || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("❌ Error querying OpenRouter:", error);
    return `There was an error processing your request: ${error}`;
  }
};

