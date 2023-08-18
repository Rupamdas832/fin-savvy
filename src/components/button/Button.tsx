import { Loader2 } from "lucide-react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  theme?: "DARK" | "LIGHT";
  isDisabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}
const Button = ({
  text,
  onClick,
  theme = "DARK",
  isDisabled = false,
  isLoading = false,
  loadingText = "Loading",
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
      className={`flex items-center justify-center py-2 px-4 w-28 min-w-fit border-none rounded-lg ${getBgColor()} ${
        theme === "DARK" ? "text-white" : "text-black"
      }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? loadingText : text}
    </button>
  );
};

export default Button;
