import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";

const tipsListEmergencyFund = [
  {
    id: 1,
    text: "Follow 50-30-20 rule. 50% of salary in needs, 30% in wants & 20% in savings",
  },
  {
    id: 2,
    text: "Use autodebit feature in bank account to save every month automatically.",
  },
];

const Savings = () => {
  const [bankBalance, setBankBalance] = useState(0);
  const [fdBalance, setFDBalance] = useState(0);
  const [equityBalance, setEquityBalance] = useState(0);
  const [goldBalance, setGoldBalance] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const handleCalculateClick = () => {
    const savings = bankBalance + fdBalance + equityBalance + goldBalance;
    setTotalSavings(savings);
  };
  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">Total Savings</p>
            <LogoBadge logo={faSackDollar} color="bg-yellow-400" />
          </div>
          <p className="text-sm  mt-2">
            Savings: ₹{" "}
            <span className="text-base font-bold">{totalSavings}</span>
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My total Bank balance is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="50000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setBankBalance(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My total FD balance is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setFDBalance(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My total investments in Equity/Mutual funds is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setEquityBalance(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              And total investments in Gold is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setGoldBalance(Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Button text="Save" onClick={handleCalculateClick} />
          </div>
          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default Savings;
