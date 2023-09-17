import LogoBadge from "@/components/badge/LogoBadge";
import Layout from "@/components/layout/Layout";
import TipsCard from "@/components/tipsCard/TipsCard";
import { calculateLoanAmountOfMonthlyEmi } from "@/utils/businessLogics";
import { getNumberSystem } from "@/utils/general";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";

const tipsListCarPlanning = [
  { id: 1, text: "Car EMI should be less than 20% of your monthly income." },
  {
    id: 2,
    text: "Pay atleast 20% of your car total price as downpayment.",
  },
];

const Car = () => {
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [loanTenure, setLoanTenure] = useState(0);
  const [interest, setInterest] = useState(0);

  const loanAmount = useMemo(() => {
    if (!monthlyEMI || !loanTenure || !interest) return 0;

    return calculateLoanAmountOfMonthlyEmi(interest, loanTenure, monthlyEMI);
  }, [monthlyEMI, loanTenure, interest]);

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">Car Planning</p>
            <LogoBadge logo={faCarSide} color="bg-emerald-400" />
          </div>
          <p className="text-sm  mt-2">
            Everyone loves to own their dream car. But can you afford it?
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              Monthly EMI you can afford{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <div className="mt-4">
              <p className="w-16 p-2 rounded-md border border-slate-700">
                {monthlyEMI}
              </p>
            </div>
            <input
              placeholder="50000"
              className="border border-spacing-1 p-2 rounded-md border-slate-500"
              type="range"
              min={0}
              max={200000}
              step={2000}
              onChange={(e) => setMonthlyEMI(Number(e.target.value))}
              value={monthlyEMI}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              Loan tenure <span className="text-gray-400">Years</span>
            </label>
            <div className="mt-4">
              <p className="w-16 p-2 rounded-md border border-slate-700">
                {loanTenure}
              </p>
            </div>
            <input
              placeholder="50000"
              className="border border-spacing-1 p-2 rounded-md border-slate-500"
              type="range"
              min={1}
              max={10}
              step={1}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              value={loanTenure}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              Loan interest rate <span className="text-gray-400">%</span>
            </label>
            <input
              placeholder="50000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setInterest(Number(e.target.value))}
              value={interest.toString()}
            />
          </div>
          <div className="flex items-center mt-4">
            <p className="w-56">Loan amount you can afford:</p>
            <p className="flex flex-1 rounded-md bg-teal-400 p-2 font-bold">
              ₹ {getNumberSystem(loanAmount)}
            </p>
          </div>
          <TipsCard list={tipsListCarPlanning} />
        </div>
      </div>
    </Layout>
  );
};

export default Car;