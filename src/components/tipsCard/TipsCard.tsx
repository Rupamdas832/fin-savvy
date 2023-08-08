import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface TipsCardProps {
  list: {
    id: number;
    text: string;
  }[];
}
const TipsCard = ({ list }: TipsCardProps) => {
  return (
    <div className="flex flex-col p-4 py-5 rounded-xl mt-4 bg-slate-300">
      <div className="flex items-center">
        <FontAwesomeIcon icon={faLightbulb} className="text-xl text-blue-400" />
        <p className="text-xl font-bold ml-2">Tips</p>
      </div>
      <ul className="pl-5 list-disc">
        {list.map((item) => {
          return <li key={item.id}>{item.text}</li>;
        })}
      </ul>
    </div>
  );
};

export default TipsCard;
