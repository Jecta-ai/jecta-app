import { MsgBroadcaster, WalletStrategy } from "@injectivelabs/wallet-ts";
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

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
});

export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy /* instantiated wallet strategy */,
  network: Network.Mainnet,
});
