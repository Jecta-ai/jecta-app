import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { addresses, balanceMin } = await req.json();

    if (!addresses || balanceMin === undefined) {
      return NextResponse.json(
        { error: "Missing required parameters: addresses or balanceMin" },
        { status: 400 }
      );
    }

    const query = `
      query getTokenHolders($addresses: [String!], $balanceMin: float8) {
        holders: wallet_tracker_balance(where: {token_id: {_in: $addresses}, balance: { _gt: $balanceMin }}, order_by: {balance:desc}) {
          wallet_id
          balance
          percentage_held
          token_id
          id
        }
        holder_aggregate: wallet_tracker_balance_aggregate(
          where: { token_id: { _in: $addresses }, balance: { _gt: 0 } }
        ) {
          aggregate { count }
        }
      }
    `;

    const response = await fetch("https://api.trippyinj.xyz/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { addresses, balanceMin } }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("GraphQL API Error:", data);
      return NextResponse.json(
        { error: "GraphQL Error", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error }, { status: 500 });
  }
}
