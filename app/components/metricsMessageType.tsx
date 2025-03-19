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
    <div className=" text-white p-6 rounded-xl  max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-center mb-4">Injective Ecosystem TVL</h2>
      <p className="text-lg text-center text-gray-200 mb-6">Total TVL: ${data.tvl.toLocaleString()}</p>
      <div className="space-y-4">
        {data.protocols.map((protocol, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg flex items-center gap-4 shadow-md flex-wrap sm:flex-nowrap">
            {protocol.logo ? (
              <img src={protocol.logo} alt={protocol.name} className="w-12 h-12 rounded-md" />
            ) : (
              <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                N/A
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold truncate">{protocol.name}</h3>
              <p className="text-sm text-gray-400">Category: {protocol.category}</p>
              {protocol.methodology && <p className="text-xs text-gray-500 mt-1 truncate">{protocol.methodology}</p>}
            </div>
            <p className="text-lg font-semibold w-full sm:w-auto text-right">${protocol.tvl.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsType;