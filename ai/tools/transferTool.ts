import axios from "axios";


export async function extractTransactionData(message: string) {

    const regex_send = /send (\d+(\.\d+)?)\s+([A-Z]+)\s+to\s+([a-zA-Z0-9]+)/;
    const regex_transfer = /transfer (\d+(\.\d+)?)\s+([A-Z]+)\s+to\s+([a-zA-Z0-9]+)/;

    const match_send = message.match(regex_send);
    const match_transfer = message.match(regex_transfer);
    let match;

    if(match_send){
        match = match_send
    }else{
        match = match_transfer
    }

    if (match) {
        const amount = parseFloat(match[1]);

        const receiver = match[4];

        if (!isValidInjectiveAddress(receiver)) {
            return {amount:0,token:"",receiver:"",status:"fail_address"};
        }

        const token = match[3].toUpperCase();
        const tokenMetadata = await fetchTokenMetadata(token)
        if(tokenMetadata  == "error"){
            return {amount:0,token:"",receiver:"",status:"fail_token"};
        }
        
        return {amount:amount,token:tokenMetadata,receiver:receiver,status:"success"};
        

        
    } else {
        return {amount:0,token:"",receiver:"",status:"fail_match"};
    }
}

function isValidInjectiveAddress(address: string): boolean {
    return /^inj1[a-z0-9]{38}$/.test(address);
}

const TOKEN_LIST_URL =
  'https://raw.githubusercontent.com/InjectiveLabs/injective-lists/refs/heads/master/json/tokens/mainnet.json'


const fetchTokenMetadata = async (ticker: string) => {
    try {
      const response = await axios.get(TOKEN_LIST_URL)
      const tokenMetadata = response.data.find((token: any) => token.symbol === ticker);
  
      if (tokenMetadata === undefined) {
        
        return "error"
      } else {
        
        return tokenMetadata
      }
    } catch (error) {
      return "error";
    }
  }
