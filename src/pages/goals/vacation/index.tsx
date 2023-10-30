import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import dayjs from "dayjs";
import { getNumberSystem } from "@/utils/general";

const tipsListEmergencyFund = [
  {
    id: 1,
    text: "Major vacation cost includes transportation, accommodation, food & activities.",
  },
  {
    id: 2,
    text: "Start saving months in advance to avoid unexpected costs.",
  },
  {
    id: 3,
    text: "Monthly investments can be done in low risk index funds if you have longer time frame for your vacation(e.g more than a year).",
  },
  {
    id: 4,
    text: "Make sure you have an emergency fund in place before focusing on your vacation fund.",
  },
];

const Vacation = () => {
  const [vacationCost, setVacationCost] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString());
  const [savedMoney, setSavedMoney] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCalculateClick = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const selectedMonthArray = selectedMonth.split("-");
    const year = Number(selectedMonthArray[0]);
    const month = Number(selectedMonthArray[1]);

    const requiredCost = vacationCost * Math.pow(1 + 0.06, year - currentYear);
    setTotalCost(requiredCost);
    setMonthlySavings(totalCost / 12);
  };

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">Vacation Planning</p>
            <LogoBadge logo={faPlane} color="bg-fuchsia-400" />
          </div>
          <p className="text-sm  mt-2">
            Planning for a vacation involves setting a budget & saving money and
            possibly making some investments.
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              Estimated total vacation cost{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="50000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setVacationCost(Number(e.target.value))}
              value={vacationCost.toString()}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              Month you are planning for the vacation
            </label>
            <input
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="month"
              onChange={(e) => setSelectedMonth(e.target.value)}
              value={dayjs(selectedMonth).format("YYYY-MM")}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              Money you have already kept aside{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setSavedMoney(Number(e.target.value))}
              value={savedMoney.toString()}
            />
          </div>
          <div className="mt-4">
            <Button
              text="Calculate"
              onClick={handleCalculateClick}
              isLoading={isSaving}
              isDisabled={isSaving}
            />
          </div>
          <div className="flex items-center mt-4">
            <p className="w-56">Vacation will cost you:</p>
            <p className="flex flex-1 rounded-md bg-teal-100 p-2 font-bold">
              ₹ {getNumberSystem(totalCost)}
            </p>
          </div>
          <div className="flex items-center mt-4">
            <p className="w-56">Monthly savings:</p>
            <p className="flex flex-1 rounded-md bg-teal-100 p-2 font-bold">
              ₹ {getNumberSystem(monthlySavings)}
            </p>
          </div>
          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default Vacation;
