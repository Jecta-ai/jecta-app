import { MsgBroadcaster, WalletStrategy, type Wallet } from "@injectivelabs/wallet-ts";
import type { ChatMessage } from "./types";
import { ChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";

export const createChatMessage = ({
  sender,
  text = "No response from AI, try again.",
  type,
  balances = null,
  validators = null,
  contractInput = null,
  send = null,
  intent = null,
  pie = null,
  token_metadata = null,
  llama = null,
  stake_info = null,
  proposals = null,
}: ChatMessage): ChatMessage => {
  return {
    sender,
    text,
    type,
    intent,
    balances,
    validators,
    contractInput,
    token_metadata,
    pie,
    send,
    llama,
    stake_info,
    proposals,
  };
};

// Dynamic Wallet Strategy Setup
let walletStrategy: WalletStrategy | null = null;

export const configureWalletStrategy = (wallet: Wallet) => {
  walletStrategy = new WalletStrategy({
    chainId: ChainId.Mainnet,
    wallet: wallet,
  });
  walletStrategy.setWallet(wallet);
  return walletStrategy;
};

export const getWalletStrategy = () => {
  if (!walletStrategy) {
    throw new Error("WalletStrategy is not initialized. Call configureWalletStrategy first.");
  }
  return walletStrategy;
};

export const msgBroadcastClient = () => {
  return new MsgBroadcaster({
    walletStrategy: getWalletStrategy(),
    network: Network.Mainnet,
  });
};
