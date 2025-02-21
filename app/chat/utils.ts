import { MsgBroadcaster, WalletStrategy, Wallet } from "@injectivelabs/wallet-ts";
import type { ChatMessage, SendDetails, ContractInput, Validator, Token } from "./types";
import { ChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";

interface CreateChatMessageInput {
  sender: string;
  text?: string;
  type: string;
  intent?: string | null;
  balances?: Token[] | null;
  validators?: Validator[] | null;
  contractInput?: ContractInput | null;
  send?: SendDetails | null;
}

export const createChatMessage = ({
  sender,
  text = "No response from AI, try again.",
  type,
  balances = null,
  validators = null,
  contractInput = null,
  send = null,
  intent = null,
}: CreateChatMessageInput): ChatMessage => {
  return {
    sender,
    text,
    type,
    intent,
    balances,
    validators,
    contractInput,
    send,
  };
};

// Dynamic Wallet Strategy Setup
let walletStrategy: WalletStrategy | null = null;

export const configureWalletStrategy = (wallet: Wallet) => {
  walletStrategy = new WalletStrategy({
    chainId: ChainId.Mainnet,
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
