import React from "react";

interface Protocol {
  name: string;
  logo: string;
  category: string;
  methodology?: string;
  tvl: number;
}

interface TVLData {
  tvl: number;
  protocols: Protocol[];
}

const MetricsType: React.FC<{ data: TVLData }> = ({ data }) => {
  return (
    <div className="text-white p-6 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 border border-blue-500 shadow-2xl max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-center mb-4 text-blue-200">Injective Ecosystem TVL</h2>
      <p className="text-lg text-center text-blue-300 mb-6">
        Total TVL: ${data.tvl.toLocaleString()}
      </p>
      <div className="space-y-4">
        {data.protocols.map((protocol, index) => (
          <div
            key={index}
            className="bg-blue-800 bg-opacity-60 p-4 rounded-lg flex items-center gap-4 shadow-lg border border-blue-600 flex-wrap sm:flex-nowrap"
          >
            {protocol.logo ? (
              <img
                src={protocol.logo}
                alt={protocol.name}
                className="w-12 h-12 rounded-md border border-blue-400"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-900 border border-blue-500 rounded-md flex items-center justify-center text-blue-300">
                N/A
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold truncate text-blue-100">{protocol.name}</h3>
              <p className="text-sm text-blue-300">Category: {protocol.category}</p>
              {protocol.methodology && (
                <p className="text-xs text-blue-400 mt-1 truncate">{protocol.methodology}</p>
              )}
            </div>
            <p className="text-lg font-semibold w-full sm:w-auto text-right text-blue-200">
              ${protocol.tvl.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsType;
