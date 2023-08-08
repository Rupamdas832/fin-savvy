interface ButtonProps {
  text: string;
  onClick: () => void;
}
const Button = ({ text, onClick }: ButtonProps) => {
  return (
    <button
      className="py-2 px-4 border-none bg-black text-white rounded-lg"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
