const ErrorMessageType = ({
  text = "",
  handleExit,
  isLastError,
}: {
  text?: string;
  handleExit: () => void;
  isLastError: boolean;
}) => {
  return (
    // ✅ Handle Error Messages with Exit Button
    <div className="p-3 rounded-xl bg-red-700 text-white max-w-[75%]">
      <p>{text}</p>

      {/* Show Exit Button ONLY for the latest error message */}
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
  );
};

export default ErrorMessageType;
