import type { Token } from "../types";

const BalanceMessageType = ({ balances }: { balances: Token[] }) => {
  return (
    <div className="p-3 rounded-xl bg-zinc-800 text-white">
      <div className="flex flex-col gap-3">
        {balances?.map((token: Token) => (
          <div
            key={token.address}
            className="flex items-center bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700"
          >
            <img src={token.logo} alt={token.symbol} className="w-10 h-10 rounded-full mr-4" />

            <div className="flex flex-col flex-1">
              <span className="text-white font-semibold text-lg">{token.symbol}</span>
              <span className="text-gray-400 text-sm">
                {Number(token.amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="text-green-400 text-sm">
                {Number(token.balance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} $
              </span>
            </div>

            <a
              href={`https://injscan.com/asset/${encodeURIComponent(token.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              Contract ↗
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BalanceMessageType;
