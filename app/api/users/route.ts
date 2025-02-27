import { createInjectiveIfNotExists, getInjectiveAddress } from "./utils";

export async function POST(req: Request) {
  const { type, injectiveAddress } = await req.json();

  if (type === "createInjective") {
    const { data, error } = await createInjectiveIfNotExists(injectiveAddress);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    return new Response(JSON.stringify({ data }), { status: 200 });
  }
}

export async function GET(req: Request) {
  const injectiveAddress = req.headers.get("injectiveAddress");

  if (!injectiveAddress) {
    return new Response(JSON.stringify({ error: "Missing injectiveAddress" }), { status: 400 });
  }
  const { data, error } = await getInjectiveAddress(injectiveAddress);
  if (error) {
    return new Response(JSON.stringify({ data }), { status: 500 });
  }
  return new Response(JSON.stringify({ data }), { status: 200 });
}
