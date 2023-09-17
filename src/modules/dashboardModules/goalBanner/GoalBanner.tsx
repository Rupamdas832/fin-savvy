import LogoBadge from "@/components/badge/LogoBadge";
import {
  faCarSide,
  faHouse,
  faPlane,
  faRing,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const GoalBanner = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col p-4 bg-white text-black">
      <p className="text-base font-bold">Goals</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl">
          <div className="flex flex-col justify-between items-start">
            <LogoBadge logo={faHouse} color="bg-lime-400" />
            <p className="text-sm">Dream House</p>
          </div>
        </div>
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl"
          onClick={() => router.push("/goals/car")}
        >
          <div className="flex flex-col justify-between items-start">
            <LogoBadge logo={faCarSide} color="bg-emerald-400" />
            <p className="text-sm">Dream Car</p>
          </div>
        </div>
        <div className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl">
          <div className="flex flex-col justify-between items-start">
            <LogoBadge logo={faPlane} color="bg-fuchsia-400" />
            <p className="text-sm">Vacation Planning</p>
          </div>
        </div>
        <div className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl">
          <div className="flex flex-col justify-between items-start">
            <LogoBadge logo={faRing} color="bg-violet-400" />
            <p className="text-sm">Marriage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalBanner;
