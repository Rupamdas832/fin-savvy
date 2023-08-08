import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";

interface LogoBadgeProps {
  logo?: any;
  color?: string;
}

const LogoBadge = ({
  logo = faSackDollar,
  color = "bg-lime-400",
}: LogoBadgeProps) => {
  return (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-full ${color}`}
    >
      <FontAwesomeIcon icon={logo} className="text-sm  text-black" />
    </div>
  );
};

export default LogoBadge;
