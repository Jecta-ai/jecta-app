import { LoadingState } from "../page";
import { useChat } from "../providers/chatProvider";
import { useValidator } from "../providers/validatorProvider";
import type { Validator } from "../types";
import { createChatMessage } from "../utils";

const ValidatorsMessageType = ({
  injectiveAddress,
  validators,
  isLastError,
  handleExit,
  setLoadingState,
  token
}: {
  injectiveAddress: string | null;
  validators: Validator[];
  isLastError: boolean;
  handleExit: () => void;
  setLoadingState: (loadingState: LoadingState) => void;
  token:string
}) => {
  const { setValidatorAddress, validatorSelected, setValidatorSelected } = useValidator();
  const { addMessage, addMessages, messageHistory } = useChat();

  const handleValidatorSelection = async (
    validatorIndex: number,
    name: string,
    validator: string
  ) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,Authorization: token ? `Bearer ${token}` : "",},
        body: JSON.stringify({
          message: `${validatorIndex}`,
          chatHistory: messageHistory,
          address: injectiveAddress,
          intent: "stake_inj_amount",
        }),
      });

      if (!res.ok) throw new Error(`Server Error: ${res.status}`);

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      await addMessage(
        token,
        createChatMessage({
          sender: "ai",
          text: `Validator #${name} selected`,
          type: "text",
        })
      );
      setValidatorAddress(validator);
      setValidatorSelected(true);
      addMessages(token,data.messages); // Update chat history
    } catch (error) {
      console.error("Chat error:", error);
      addMessage(token,

        createChatMessage({
          sender: "ai",
          text: "Error processing request",
          type: "error",
        })
      );
    } finally {
      setLoadingState(null);
    }
  };

  return (
    <>
      <div className="p-3 rounded-xl bg-zinc-800 text-white max-w-[75%]">
        <h3 className="text-lg font-semibold mb-2">Choose a Validator:</h3>

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
