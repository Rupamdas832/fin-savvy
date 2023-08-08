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
    text: "Don’t forget to buy a term plan if you have any kind of existing debt.",
  },
  {
    id: 2,
    text: "Having an emergency fund is a must before taking more debt.",
  },
  {
    id: 3,
    text: "Make sure that your car loan EMI does not exceed 10% of your salary.",
  },
  {
    id: 4,
    text: "Keep your credit card utilization below 30%",
  },
];

const DebtDiagnosis = () => {
  const [monthlyIncome, setMontlyIncome] = useState(0);
  const [loan, setLoan] = useState(0);
  const [emi, setEMI] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);

  const handleCalculateClick = () => {
    console.log("saved");
  };

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">Debt Diagnosis</p>
            <LogoBadge logo={faSackDollar} color="bg-cyan-400" />
          </div>
          <p className="text-sm  mt-2">
            Are your current loans posing a threat to your financial stability?
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My monthly income is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="50000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setMontlyIncome(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              I have to repay a loan of{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setLoan(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              I pay EMIs of <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="20000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setEMI(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My savings and investments{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setTotalSavings(Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Button text="Calculate" onClick={handleCalculateClick} />
          </div>
          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default DebtDiagnosis;
