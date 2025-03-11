import jwt from "jsonwebtoken";
import { Buffer } from "node:buffer";
import { PubKeySecp256k1, Hash } from "@keplr-wallet/crypto";
import { serializeSignDoc } from "@keplr-wallet/cosmos";
import { supabase } from "@/lib/supabaseClient";


export async function POST(req: Request) {
  try {
    const { nonce, signature, pubkey, address } = await req.json();

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
            data: Buffer.from(nonce).toString("base64"),
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

    } catch (error) {
      console.error("Keccak-256 verification failed:", error);
    }

    if (isValid) {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", address)
        .eq("nonce", nonce)
        .single();

      if (data) {
        const token = jwt.sign(
          {
            aud: "authenticated",
            wallet_address: address,
            nonce: nonce,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            user_metadata: {
              user_id: address,
              nonce: nonce,
            },
            role: "authenticated",
          },
          process.env.SUPABASE_JWT_SECRET as string
        );
        return new Response(JSON.stringify({ isValid: true, token }), { status: 200 });
      }
      return new Response(JSON.stringify({ isValid: false, token: null }), { status: 200 });
    }
    return new Response(JSON.stringify({ isValid: false, token: null }), { status: 200 });
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
