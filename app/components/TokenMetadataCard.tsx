import React from "react";

const TokenMetadataCard: React.FC<{ msg: any }> = ({ msg }) => {
  if (msg.type !== "tokenmetadata") return null;

  const { name, symbol, supply, logo, holder_amount, price, token_type, contract } = msg.token_metadata;

  return (
    <div className="p-4 rounded-lg bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white shadow-md border border-green-400 
      transition-all duration-300 w-full max-w-xs md:max-w-md lg:max-w-lg flex flex-col justify-between mx-auto">
      
      <div className="flex items-center space-x-3 mb-3">
        <img
          src={logo}
          alt={name}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-green-400"
        />
        <div>
          <h2 className="text-lg sm:text-xl font-bold uppercase text-green-100">{name}</h2>
          <p className="text-sm sm:text-base font-semibold text-green-200">{symbol}</p>
        </div>
      </div>

      <div className="text-sm sm:text-base text-white space-y-1">
        <p><span className="font-bold">CA:</span> {contract}</p>
        <p><span className="font-bold">Type:</span> {token_type}</p>
        <p><span className="font-bold">Price:</span> {price} $</p>
        <p><span className="font-bold">Supply:</span> {supply.toLocaleString()}</p>
        <p><span className="font-bold">Holders:</span> {holder_amount.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default TokenMetadataCard;
