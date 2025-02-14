import type { Validator } from "../types";

const ValidatorsMessageType = ({
  validators,
  validatorSelected,
  handleValidatorSelection,
  isLastError,
  handleExit,
}: {
  validators: Validator[];
  validatorSelected: boolean;
  handleValidatorSelection: (index: number, moniker: string, address: string) => void;
  isLastError: boolean;
  handleExit: () => void;
}) => {
  return (
    <>
      <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
        <h3 className="text-lg font-semibold mb-2">Choose a Validator:</h3>

        {/* ✅ Grid Layout for Validators */}
        <div className="grid grid-cols-4 gap-3">
          {validators?.map(
            (
              validator: {
                moniker: string;
                address: string;
                commission: string;
              },
              index: number
            ) => (
              <button
                type="button"
                key={validator.address}
                onClick={() => {
                  if (!validatorSelected) {
                    handleValidatorSelection(index, validator.moniker, validator.address);
                  } else {
                    alert("Validator already selected !");
                  }
                }}
                className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 flex flex-col items-center text-center"
              >
                <span className="block font-semibold">{validator.moniker}</span>
                <span className="text-sm text-gray-300">Commission: {validator.commission}</span>
              </button>
            )
          )}
        </div>

        {isLastError && (
          <button
            type="button"
            onClick={handleExit}
            className="mt-3 px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-300"
          >
            Exit
          </button>
        )}
      </div>
    </>
  );
};

export default ValidatorsMessageType;
