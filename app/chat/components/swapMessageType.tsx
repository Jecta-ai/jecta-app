import type { ContractInput } from "../types";

const SwapMessageType = ({
  text,
  executing,
  handleExit,
  confirmSwap,
  contractInput,
}: {
  text: string;
  executing: boolean;
  handleExit: () => void;
  confirmSwap: (contractInput: ContractInput) => void;
  contractInput: ContractInput;
}) => {
  return (
    <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%] ">
      <h3 className="text-lg font-semibold mb-2">Your Swap Details</h3>
      <div>{text}</div>
      {!executing && (
        <div className=" space-x-4">
          <button
            type="button"
            onClick={handleExit}
            className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
          >
            Exit
          </button>
          <button
            type="button"
            onClick={() => {
              if (contractInput) {
                confirmSwap(contractInput);
              }
            }}
            className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default SwapMessageType;
