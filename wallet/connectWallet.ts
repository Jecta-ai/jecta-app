import { ChainId } from "@injectivelabs/ts-types";

export const connectWallet = async (addToChat: (msg: any) => void) => {
  if (!window.keplr) {
    alert("Keplr Wallet is not installed. Please install it and try again.");
    return;
  }

  try {
    await window.keplr.disable(ChainId.Mainnet);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await window.keplr.enable(ChainId.Mainnet);

    const keplrOfflineSigner = window.keplr.getOfflineSigner(ChainId.Mainnet);
    const accounts = await keplrOfflineSigner.getAccounts();

    if (!accounts.length) {
      alert("No Injective accounts found in Keplr.");
      return;
    }

    const injectiveAddress = accounts[0].address;
    const res = await fetch("/api/db", {
      method: "POST",
      body: JSON.stringify({ type: "createInjective", injectiveAddress }),
    });

    localStorage.setItem("injectiveAddress", injectiveAddress);

    alert(`Connected! Your Injective address is: ${injectiveAddress}`);

    addToChat({
      sender: "system",
      text: `User's Injective wallet address is: ${injectiveAddress}. If user asks you about his wallet address, you need to remember it.`,
      type: "text",
      intent: "general",
    });

    return injectiveAddress;
  } catch (error) {
    console.error("Error connecting to Keplr:", error);
    alert("Failed to connect Keplr wallet. Please try again.");
  }
};
