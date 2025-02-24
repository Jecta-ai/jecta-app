//ONLY WORKS WITH KEPLR WALLET
//CURRENTLY WE'LL DELETE CONNECT WITH LEAP BUTTON RN

import { Buffer } from "buffer";
import { PubKeySecp256k1, Hash } from "@keplr-wallet/crypto";
import { serializeSignDoc } from "@keplr-wallet/cosmos";
//IMPORTANT !

export async function POST(req: Request) {
  try {
    console.log("here");
    const { message, signature, pubkey, address } = await req.json();

    console.log("Received address:", address);
    console.log("Received pubkey:", pubkey);
    console.log("Received message:", message);

    // Convert parameters to the correct types
    // Convert base64 pubkey and signature to Uint8Array
    const pubKeyUint8Array = new Uint8Array(Buffer.from(pubkey, "base64"));
    const signatureUint8Array = new Uint8Array(Buffer.from(signature, "base64"));

    // Create a PubKeySecp256k1 instance
    const cryptoPubKey = new PubKeySecp256k1(pubKeyUint8Array);

    // Create a sign doc similar to what Keplr uses for arbitrary message signing
    const signDoc = {
      chain_id: "",
      account_number: "0",
      sequence: "0",
      fee: {
        gas: "0",
        amount: [],
      },
      msgs: [
        {
          type: "sign/MsgSignData",
          value: {
            signer: address,
            data: Buffer.from(message).toString("base64"),
          },
        },
      ],
      memo: "",
    };

    // Serialize the sign doc
    const serializedSignDoc = serializeSignDoc(signDoc);

    // Try both hashing algorithms
    let isValid = false;

    // Try with Keccak-256 (for EVM compatible chains like Injective)
    try {
      const keccakHash = Hash.keccak256(serializedSignDoc);
      isValid = cryptoPubKey.verifyDigest32(keccakHash, signatureUint8Array);
      console.log("Keccak-256 verification result:", isValid);
    } catch (error) {
      console.error("Keccak-256 verification failed:", error);
    }

    console.log(" POST -> isValid:", isValid);
    return new Response(JSON.stringify({ isValid }), { status: 200 });
  } catch (error) {
    console.error("Error in verification:", error);
    return new Response(
      JSON.stringify({
        isValid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500 }
    );
  }
}
