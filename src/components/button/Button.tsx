import { Loader2 } from "lucide-react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  theme?: "DARK" | "LIGHT";
  isDisabled?: boolean;
  isLoading?: boolean;
}
const Button = ({
  text,
  onClick,
  theme = "DARK",
  isDisabled = false,
  isLoading = false,
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
      className={`flex items-center justify-center py-2 px-4 border-none rounded-lg ${getBgColor()} ${
        theme === "DARK" ? "text-white" : "text-black"
      } rounded-lg`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {isLoading && (
        <div className="p-1">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      )}
      {isLoading ? "" : text}
    </button>
  );
};

export default Button;
