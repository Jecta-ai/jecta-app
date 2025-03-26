import React from "react";

const TokenMetadataCard: React.FC<{ msg: any }> = ({ msg }) => {
  if (msg.type !== "tokenmetadata") return null;

  const { name, symbol, supply, logo, holder_amount, price, token_type, contract } = msg.token_metadata;

  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 text-white shadow-md border border-blue-500 
      transition-all duration-300 w-full max-w-xs md:max-w-md lg:max-w-lg flex flex-col justify-between mx-auto">
      
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={logo}
          alt={name}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-blue-400"
        />
        <div>
          <h2 className="text-lg sm:text-xl font-bold uppercase text-blue-100">{name}</h2>
          <p className="text-sm sm:text-base font-semibold text-blue-200">{symbol}</p>
        </div>
      </div>

      <div className="text-sm sm:text-base text-white space-y-1">
        <p><span className="font-bold text-blue-200">CA:</span> {contract}</p>
        <p><span className="font-bold text-blue-200">Type:</span> {token_type}</p>
        <p><span className="font-bold text-blue-200">Price:</span> {price} $</p>
        <p><span className="font-bold text-blue-200">Supply:</span> {supply.toLocaleString()}</p>
        <p><span className="font-bold text-blue-200">Holders:</span> {holder_amount.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TokenMetadataCard;
