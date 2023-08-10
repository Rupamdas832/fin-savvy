import LogoBadge from "@/components/badge/LogoBadge";
import Link from "next/link";
import {
  faBuildingColumns,
  faHandHoldingDollar,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

interface OverviewBannerProps {
  user_id: string;
}

const OverviewBanner = ({ user_id }: OverviewBannerProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col p-4 bg-white rounded-t-2xl text-black">
      <p className="text-base font-bold">Statistics</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl cursor-pointer"
          onClick={() => router.push("/emergency-fund")}
        >
          <div className="flex flex-col justify-between">
            <LogoBadge logo={faSackDollar} color="bg-green-400" />
            <p className="text-sm">Emergency Fund</p>
          </div>
          <div>
            <p className="text-sm font-bold">10%</p>
          </div>
        </div>
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl cursor-pointer"
          onClick={() => router.push("/insurance-planner")}
        >
          <div className="flex flex-col justify-between">
            <LogoBadge logo={faShieldHalved} color="bg-pink-400" />
            <p className="text-sm">Insurance Planner</p>
          </div>
          <div>
            <p className="text-sm font-bold">50%</p>
          </div>
        </div>
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl cursor-pointer"
          onClick={() => router.push("/debt-diagnosis")}
        >
          <div className="flex flex-col justify-between">
            <LogoBadge logo={faHandHoldingDollar} color="bg-cyan-400" />
            <p className="text-sm">Debt Diagnosis</p>
          </div>
          <div>
            <p className="text-sm font-bold">2/10</p>
          </div>
        </div>
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl cursor-pointer"
          onClick={() => router.push("/tax-saving")}
        >
          <div className="flex flex-col justify-between">
            <LogoBadge logo={faBuildingColumns} color="bg-amber-400" />
            <p className="text-sm">Tax Saving</p>
          </div>
          <div>
            <p className="text-sm font-bold">3/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewBanner;
