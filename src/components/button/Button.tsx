interface ButtonProps {
  text: string;
  onClick: () => void;
  theme?: "DARK" | "LIGHT";
  isDisabled?: boolean;
}
const Button = ({
  text,
  onClick,
  theme = "DARK",
  isDisabled = false,
}: ButtonProps) => {
  const getBgColor = () => {
    const color =
      theme === "DARK"
        ? isDisabled
          ? "bg-stone-600"
          : "bg-black"
        : isDisabled
        ? "bg-stone-600"
        : "bg-white";
    return color;
  };
  return (
    <button
      className={`py-2 px-4 border-none ${getBgColor()} ${
        theme === "DARK" ? "text-white" : "text-black"
      } rounded-lg`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
};

export default Button;
