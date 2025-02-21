export interface Token {
  logo: string;
  symbol: string;
  balance: string;
  address: string;
}

export interface Validator {
  moniker: string;
  address: string;
  commission: string;
}

export interface SendDetails {
  token: {
    tokenType: string;
    address: string;
    decimals: number;
    denom: string;
  };
  receiver: string;
  amount: number;
}

export interface ContractInput {
  address: string;
  executeMsg: {
    send?: any;
    execute_routes?: any;
  };
  funds?: any;
}

export interface ChatMessage {
  balances?: Token[] | null;
  sender: string;
  text: string;
  type?: string;
  intent?: string | null;
  validators?: Validator[] | null;
  contractInput?: ContractInput | null;
  send?: SendDetails | null;
}
