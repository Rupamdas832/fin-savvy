import { useMemo } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import {
  faBuildingColumns,
  faHandHoldingDollar,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { FinanceType } from "@/types/finance.type";

interface OverviewBannerProps {
  user_id: string;
  finance: FinanceType | null;
}

const OverviewBanner = ({ user_id, finance }: OverviewBannerProps) => {
  const router = useRouter();

  const getPercentage = () => {
    if (!finance) return 0;
    const p =
      ((finance?.bank_balance + finance?.fd_balance) /
        finance?.emergency_fund) *
      100;
    return p.toFixed();
  };

  const getInsuranceScore = useMemo(() => {
    let life = 0;
    let health = 0;
    let critical = 0;
    let accident = 0;

    if (finance?.required__life_insurance_cover) {
      life = Math.floor(
        finance?.life_insurance_cover / finance?.required__life_insurance_cover
      );
    }
    if (finance?.required_accidental_death_cover) {
      accident = Math.floor(
        finance?.accidental_death_cover /
          finance?.required_accidental_death_cover
      );
    }
    if (finance?.required_critical_illness_cover) {
      critical = Math.floor(
        finance?.critical_illness_cover /
          finance?.required_critical_illness_cover
      );
    }
    if (finance?.required_health_insurance_cover) {
      health = Math.floor(
        finance?.health_insurance_cover /
          finance?.required_health_insurance_cover
      );
    }
    const score = life + health + critical + accident;
    return score;
  }, [finance]);

  const getDebtScore = useMemo(() => {
    let score = 1;
    const load = finance ? finance?.emi_load : 0;
    const arr = [20, 40, 60, 80, 100];
    if (load < 20) {
      score = 5;
    } else if (load < 40) {
      score = 4;
    } else if (load < 60) {
      score = 3;
    } else if (load < 80) {
      score = 2;
    }
    return score;
  }, [finance]);

  const getTaxScore = useMemo(() => {
    let score = 0;
    if (finance) {
      if (finance.required_80C_investment <= 0) {
        score += 1;
      }
      if (finance.required_80D_investment <= 0) {
        score += 1;
      }
      if (finance.required_80CCD_investment <= 0) {
        score += 1;
      }
    }
    return score;
  }, [finance]);

  return (
    <div className="flex flex-col p-4 bg-white rounded-t-2xl text-black">
      <p className="text-base font-bold">Statistics</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl cursor-pointer"
          onClick={() => router.push(`/emergency-fund`)}
        >
          <div className="flex flex-col justify-between">
            <LogoBadge logo={faSackDollar} color="bg-green-400" />
            <p className="text-sm">Emergency Fund</p>
          </div>
          <div>
            <p className="text-sm font-bold">
              {finance?.emergency_fund ? getPercentage() : 0}%
            </p>
          </div>
        </div>
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl cursor-pointer"
          onClick={() => router.push(`/insurance-planner`)}
        >
          <div className="flex flex-col justify-between">
            <LogoBadge logo={faShieldHalved} color="bg-pink-400" />
            <p className="text-sm">Insurance Planner</p>
          </div>
          <div>
            <p className="text-sm font-bold">{getInsuranceScore}/4</p>
          </div>
        </div>
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl cursor-pointer"
          onClick={() => router.push(`/debt-diagnosis`)}
        >
          <div className="flex flex-col justify-between">
            <LogoBadge logo={faHandHoldingDollar} color="bg-cyan-400" />
            <p className="text-sm">Debt Diagnosis</p>
          </div>
          <div>
            <p className="text-sm font-bold">{getDebtScore}/5</p>
          </div>
        </div>
        <div
          className="flex justify-between p-4 h-28 shadow-md shadow-slate-400 rounded-2xl cursor-pointer"
          onClick={() => router.push(`/tax-saving`)}
        >
          <div className="flex flex-col justify-between">
            <LogoBadge logo={faBuildingColumns} color="bg-amber-400" />
            <p className="text-sm">Tax Saving</p>
          </div>
          <div>
            <p className="text-sm font-bold">{getTaxScore}/3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewBanner;
