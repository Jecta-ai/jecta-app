import type { Wallet } from "@injectivelabs/wallet-ts";
import { configureWalletStrategy, getWalletStrategy } from "@/app/chat/utils";
import { Keplr } from "@keplr-wallet/provider-extension";

export const connectToWallet = async (wallet: Wallet) => {
  try {
    configureWalletStrategy(wallet);

    const walletStrategy = getWalletStrategy();
    const addresses = await walletStrategy.getAddresses();
    const pubkey = await walletStrategy.getPubKey(addresses[0]);

    if (addresses.length === 0) {
      console.error("No addresses found.");
      return;
    }

    console.log(addresses);
    const res = await fetch("/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json", injectiveAddress: addresses[0] },
    });

    const userData = await res.json();
    if (!userData.data || Object.keys(userData.data).length === 0) {
      return { address: addresses[0], wallet: wallet };
    }
    console.log("-->>>userData", userData);
    const nonce = await fetch("/api/auth/nonce", {
      method: "POST",
      body: JSON.stringify({ address: addresses[0] }),
    });
    const nonceData = await nonce.json();

    const signStatus = await signMessage(addresses[0], pubkey, nonceData.nonce);

    if (signStatus === "success") {
      return { address: addresses[0], wallet: wallet };
    }

    //TODO: Save user’s wallet address to chat history
    /*
    addToChat(createChatMessage({
        sender: "sender",
        text: ⁠ My Injective wallet address is: ${addresses[0]}. If user asks you about his wallet address, you need to remember it. ⁠,
        type: "text",
        intent: "general",
      }));
    */
  } catch (error) {
    console.error(`Error connecting to ${wallet}:`, error);
  }
};

const signMessage = async (address: string, pubkey: string, nonce: string) => {
  try {
    const walletStrategy = getWalletStrategy();
    const signedMessage = await walletStrategy.signArbitrary(address, nonce);

    if (signedMessage) {
      const res = await fetch("/api/auth/verifyArbitrary", {
        method: "POST",
        body: JSON.stringify({ nonce, signature: signedMessage, pubkey, address }),
      });
      const isValid = await res.json();

      if (isValid) {
        return "success";
      }
    }

    return "failed";
  } catch (error) {
    throw new Error("Signing error", { cause: error });
  }
};

//ONLY WORKS WITH KEPLR WALLET
//CURRENTLY WE'LL DELETE CONNECT WITH LEAP BUTTON RN
//IMPORTANT !
export const verifyArbitrary = async (
  message: string,
  signature: string,
  pubkey: string,
  address: string,
  keplr?: Keplr
): Promise<boolean> => {
  try {
    const stdSignature = {
      pub_key: {
        type: "tendermint/PubKeySecp256k1",
        value: pubkey,
      },
      signature: signature,
    };
    if (keplr) {
      const isValid = await keplr.verifyArbitrary("injective-1", address, message, stdSignature);
      console.log("✅ Keplr Verification Result:", isValid);
      return isValid;
    }
    return false;
  } catch (error) {
    console.error("❌ Error verifying signature with Keplr:", error);
    return false;
  }
};
