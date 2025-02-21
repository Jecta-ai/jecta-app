import { Wallet } from "@injectivelabs/wallet-ts";
import { useState } from "react";
import { createChatMessage, configureWalletStrategy, getWalletStrategy } from "@/app/chat/utils";

export const connectToWallet = async (wallet: Wallet) => {
  try {
    // Configure Wallet Strategy dynamically
    configureWalletStrategy(wallet);

    const walletStrategy = getWalletStrategy();
    const addresses = await walletStrategy.getAddresses();

    if (addresses.length === 0) {
      console.error("No addresses found.");
      return;
    }

    await signMessage(addresses[0]);

    //TODO: Save user’s wallet address to chat history
    /*
    addToChat(createChatMessage({
        sender: "sender",
        text: `My Injective wallet address is: ${addresses[0]}. If user asks you about his wallet address, you need to remember it.`,
        type: "text",
        intent: "general",
      }));
    */

    return { address: addresses[0], wallet: wallet };
  } catch (error) {
    console.error(`Error connecting to ${wallet}:`, error);
  }
};

const signMessage = async (address: string) => {
  try {
    const message = "Please sign this message to verify ownership.";
    const walletStrategy = getWalletStrategy();
    const signedMessage = await walletStrategy.signArbitrary(address, message);
    console.log("Signed Message:", signedMessage);
  } catch (error) {
    console.error("Error signing message:", error);
  }
};
