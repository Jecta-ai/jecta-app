import { MsgBroadcaster, WalletStrategy } from "@injectivelabs/wallet-ts";
import type { SendDetails, ContractInput, Validator, Token } from "./types";
import { ChainId } from "@injectivelabs/ts-types";
import { Network } from "@injectivelabs/networks";

interface ChatMessage {
  sender: string;
  message: string;
  type: string;
  intent?: string | null;
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
  intent = null,
}: ChatMessage) => {
  return {
    sender: sender,
    text: message,
    type: type,
    intent: intent,
    balances: balances,
    validators: validators,
    contractInput: contractInput,
    send: send,
  };
};

export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
});
export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy /* instantiated wallet strategy */,
  network: Network.Mainnet,
});
