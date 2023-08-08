import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faPlaneDeparture } from "@fortawesome/free-solid-svg-icons";
import { faRing } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GoalBanner = () => {
  return (
    <div className="flex flex-col p-4 bg-white text-black">
      <p className="text-base font-bold">Goals</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl">
          <div className="flex flex-col justify-between items-start">
            <FontAwesomeIcon
              icon={faHouse}
              className="text-2xl text-yellow-900"
            />
            <p className="text-sm">Dream House</p>
          </div>
        </div>
        <div className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl">
          <div className="flex flex-col justify-between items-start">
            <FontAwesomeIcon
              icon={faCarSide}
              className="text-2xl text-red-600"
            />
            <p className="text-sm">Dream Car</p>
          </div>
        </div>
        <div className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl">
          <div className="flex flex-col justify-between items-start">
            <FontAwesomeIcon
              icon={faPlaneDeparture}
              className="text-2xl text-blue-400"
            />
            <p className="text-sm">Vacation Planning</p>
          </div>
        </div>
        <div className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl">
          <div className="flex flex-col justify-between items-start">
            <FontAwesomeIcon icon={faRing} className="text-2xl text-gray-700" />
            <p className="text-sm">Marriage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalBanner;
