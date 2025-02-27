const DefaultMessageType = ({ text = "", sender }: { text?: string; sender: string }) => {
  return (
    <div
      className={`p-3 rounded-xl max-w-[75%] ${
        sender === "user" ? "bg-white text-black self-end" : "bg-zinc-800 text-white self-start"
      }`}
      style={{
        wordBreak: "break-word",
        maxWidth: "100%",
        overflowWrap: "anywhere",
      }}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default DefaultMessageType;
