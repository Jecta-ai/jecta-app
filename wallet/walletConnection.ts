import type { Wallet } from "@injectivelabs/wallet-ts";
import { configureWalletStrategy, getWalletStrategy } from "@/app/utils";

export const connectToWallet = async (
  wallet: Wallet
): Promise<{ address: string | null; wallet: Wallet; token: string | null }> => {
  try {
    configureWalletStrategy(wallet);

    const walletStrategy = getWalletStrategy();
    const addresses = await walletStrategy.getAddresses();
    const pubkey = await walletStrategy.getPubKey(addresses[0]);

    if (addresses.length === 0) {
      console.error("No addresses found.");
      return { address: null, wallet: wallet, token: null };
    }

    const res = await fetch("/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json", injectiveAddress: addresses[0] },
    });

    const userData = await res.json();

    if (userData.data == null) {
      return { address: addresses[0], wallet: wallet, token: null };
    }
    const nonce = await fetch("/api/auth/nonce", {
      method: "POST",
      body: JSON.stringify({ address: addresses[0] }),
    });
    const nonceData = await nonce.json();

    const { status, token } = await signMessage(addresses[0], pubkey, nonceData.nonce);

    if (status === "success") {
      return { address: addresses[0], wallet: wallet, token: token };
    }

    return { address: null, wallet: wallet, token: null };
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
    return { address: null, wallet: wallet, token: null };
  }
};

const signMessage = async (
  address: string,
  pubkey: string,
  nonce: string
): Promise<{ status: string; token: string | null }> => {
  try {
    const walletStrategy = getWalletStrategy();
    const signedMessage = await walletStrategy.signArbitrary(address, nonce);

    if (signedMessage) {
      const res = await fetch("/api/auth/verifyArbitrary", {
        method: "POST",
        body: JSON.stringify({ nonce, signature: signedMessage, pubkey, address }),
      });
      const { isValid, token } = await res.json();

      if (isValid) {
        return { status: "success", token };
      }
    }

    return { status: "failed", token: null };
  } catch (error) {
    throw new Error("Signing error", { cause: error });
  }
};
