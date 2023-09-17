import { Loader2 } from "lucide-react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  theme?: "DARK" | "LIGHT" | "DESTRUCTIVE";
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
    switch (theme) {
      case "DARK":
        return isDisabled ? "bg-stone-600" : "bg-black";
      case "LIGHT":
        return isDisabled ? "bg-stone-600" : "bg-white";
      case "DESTRUCTIVE":
        return isDisabled ? "bg-stone-600" : "bg-red-600";
      default:
        return isDisabled ? "bg-stone-600" : "bg-black";
    }
  };

  return (
    <button
      className={`flex items-center justify-center py-2 px-4 border-none rounded-lg ${getBgColor()} ${
        theme === "LIGHT" ? "text-black" : "text-white"
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
