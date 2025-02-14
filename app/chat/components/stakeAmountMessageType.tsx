const StakeAmountMessageType = ({
  setAmount,
  handleExit,
  confirmStake,
}: {
  setAmount: (amount: string) => void;
  handleExit: () => void;
  confirmStake: () => void;
}) => {
  return (
    <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
      <h3 className="text-lg font-semibold mb-2">Enter Staking Amount:</h3>
      <input
        type="number"
        placeholder="Amount in INJ"
        className="p-2 rounded-lg bg-gray-700 text-white w-full"
        onChange={(e) => setAmount(e.target.value)}
        //onKeyDown={(e) => e.key === "Enter" && handleStakeAmount(e.target.value)}
      />
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
          onClick={confirmStake}
          className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default StakeAmountMessageType;
