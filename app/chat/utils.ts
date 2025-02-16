import { MsgBroadcaster, WalletStrategy } from "@injectivelabs/wallet-ts";
import type { ChatMessage, SendDetails, ContractInput, Validator, Token } from "./types";
import { ChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";

interface CreateChatMessageInput {
  sender: string;
  message: string;
  type: string;
  intent?: string;
  balances?: Token[] | null;
  validators?: Validator[] | null;
  contractInput?: ContractInput | null;
  send?: SendDetails | null;
}

export const createChatMessage = ({
  sender,
  message,
  type,
  balances = null,
  validators = null,
  contractInput = null,
  send = null,
  intent,
}: CreateChatMessageInput): ChatMessage => {
  return {
    sender,
    text: message,
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
