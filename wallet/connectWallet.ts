import { ChainId } from "@injectivelabs/ts-types";
import { DirectSignResponse } from "@cosmjs/proto-signing";

export const connectWallet = async (addToChat: (msg: any) => void) => {
  console.log("connectWal -> addToChat:", addToChat);
  if (!window.keplr) {
    alert("Keplr Wallet is not installed. Please install it and try again.");
    return;
  }

  try {
    // ✅ Reset Keplr permissions to force approval every time
    await window.keplr.disable(ChainId.Mainnet);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait before re-enabling
    await window.keplr.enable(ChainId.Mainnet); // Require user approval

    // ✅ Get Injective Address
    const keplrOfflineSigner = window.keplr.getOfflineSigner(ChainId.Mainnet);
    console.log("connectWal -> keplrOfflineSigner:", keplrOfflineSigner);
    const accounts = await keplrOfflineSigner.getAccounts();
    console.log("connectWal -> accounts:", accounts);

    if (!accounts.length) {
      alert("No Injective accounts found in Keplr.");
      return;
    }

    const injectiveAddress = accounts[0].address;
    console.log("connectWal -> injectiveAddress:", injectiveAddress);
    console.log({ "ChainId.Mainnet": ChainId.Mainnet, injectiveAddress });

    // ✅ Sign a Message to Accept Terms
    // const msg = "By signing this message, you agree to the terms of use.";
    // const signResult: DirectSignResponse = await window.keplr.signArbitrary(
    //   ChainId.Mainnet,
    //   injectiveAddress,
    //   msg
    // );
    // console.log("connectWal -> signResult:", signResult);

    // if (!signResult) {
    //   alert("Signature failed. You must accept the terms to connect.");
    //   return;
    // }

    // ✅ Store the signed address in localStorage
    localStorage.setItem("injectiveAddress", injectiveAddress);
    // localStorage.setItem("signature", JSON.stringify(signResult));

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
