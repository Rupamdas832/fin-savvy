import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import ProgressCard from "@/components/progressCard/ProgressCard";
import LogoBadge from "@/components/badge/LogoBadge";

const tipsListEmergencyFund = [
  { id: 1, text: "Invest in liquid assets to build your emergency fund." },
  {
    id: 2,
    text: "Use lump sum inflow like bonus, income tax refunds, or surprise cashbacks to build your required emergency fund earlier.",
  },
  {
    id: 3,
    text: "Alternatively, you can use your monthly surplus to recharge your emergency fund.",
  },
];

const EmergencyFund = () => {
  const [income, setIncome] = useState(0);
  const [savings, setSavings] = useState(0);
  const [stability, setStability] = useState(5);
  const [emergencyFund, setEmergencyFund] = useState(0);

  const handleCalculateClick = () => {
    if (income) {
      const requiredFund = (income * 24) / stability;
      setEmergencyFund(Math.round(requiredFund));
    }
  };
  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">Emergency Fund</p>
            <LogoBadge logo={faSackDollar} color="bg-green-400" />
          </div>
          <p className="text-sm  mt-2">
            Do you think your current Emergency Fund is adequate to protect you
            from financial uncertainities? Check now.
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              Your monthly income is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="50000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My bank balance + FD is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setSavings(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">How much stable is your income?</label>
            <select
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              value={stability}
              onChange={(e) => setStability(Number(e.target.value))}
            >
              <option value={5}>Very stable</option>
              <option value={4}>Stable</option>
              <option value={3}>Somewhat stable</option>
              <option value={2}>Unstable</option>
              <option value={1}>Very unstable</option>
            </select>
          </div>
          <div className="mt-4">
            <Button text="Calculate" onClick={handleCalculateClick} />
          </div>
          {emergencyFund !== 0 && (
            <div className="mt-4">
              <div className="flex">
                <p className="text-2xl font-bold">Problem Analysis</p>
                <FontAwesomeIcon
                  icon={faHandPointDown}
                  className="text-2xl ml-2 text-yellow-500"
                />
              </div>
              <div className="my-4">
                <ProgressCard
                  logo={faSackDollar}
                  title="Emergency Fund"
                  currentValue={savings}
                  totalValue={emergencyFund}
                />
              </div>
            </div>
          )}
          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyFund;
