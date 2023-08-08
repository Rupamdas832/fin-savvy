import React, { useMemo } from "react";
import LogoBadge from "../badge/LogoBadge";

interface ProgressCardProps {
  logo: any;
  title: string;
  totalValue: number;
  currentValue: number;
}

const ProgressCard = ({
  logo,
  title,
  totalValue,
  currentValue,
}: ProgressCardProps) => {
  const percentage = useMemo(() => {
    if (!totalValue) return 0;
    return (currentValue * 100) / totalValue;
  }, [currentValue, totalValue]);

  return (
    <div className="flex justify-between w-full p-4 rounded-xl shadow-md shadow-slate-400">
      <div className="flex items-center w-3/5">
        <LogoBadge logo={logo} color="bg-green-500" />
        <div className="flex flex-col flex-1 ml-2">
          <label className="text-base font-bold">{title}</label>
          <div className="mt-2 h-2 w-full bg-cyan-200 rounded-xl border-1 border-cyan-800 overflow-hidden">
            <div
              className="bg-cyan-500 h-full"
              style={{ width: `${percentage}%` }}
              id="progress-bar"
            ></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <p className="text-sm">
          ₹ {currentValue}\{totalValue}
        </p>
        <p className="text-sm font-bold">{percentage.toFixed(0)}%</p>
      </div>
    </div>
  );
};

export default ProgressCard;
