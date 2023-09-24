import LogoBadge from "@/components/badge/LogoBadge";
import Layout from "@/components/layout/Layout";
import TipsCard from "@/components/tipsCard/TipsCard";
import { calculateLoanAmountOfMonthlyEmi } from "@/utils/businessLogics";
import { getNumberSystem } from "@/utils/general";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";

const tipsListCarPlanning = [
  { id: 1, text: "Car EMI should be less than 15% of your monthly income." },
  {
    id: 2,
    text: "Pay atleast 20% of your car total price as downpayment.",
  },
];

const Car = () => {
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [loanTenure, setLoanTenure] = useState(0);
  const [interest, setInterest] = useState(0);

  const loanAmount = useCallback(() => {
    if (!monthlyEMI || !loanTenure || !interest)
      return { loan: 0, downpayment: 0, total: 0 };

    const loan = calculateLoanAmountOfMonthlyEmi(
      interest,
      loanTenure,
      monthlyEMI
    );
    const downpayment = (loan * 0.2) / 0.8;
    const total = loan + downpayment;
    return { loan, downpayment, total };
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
              <input
                className="w-16 p-2 rounded-md border border-slate-700"
                value={monthlyEMI}
                onChange={(e) => setMonthlyEMI(Number(e.target.value))}
                min={0}
                max={200000}
              />
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
            <p className="w-56">Loan amount:</p>
            <p className="flex flex-1 rounded-md bg-teal-100 p-2 font-bold">
              ₹ {getNumberSystem(loanAmount().loan)}
            </p>
          </div>
          <div className="flex items-center mt-4">
            <p className="w-56">Recomended downpayment:</p>
            <p className="flex flex-1 rounded-md bg-teal-100 p-2 font-bold">
              ₹ {getNumberSystem(loanAmount().downpayment)}
            </p>
          </div>
          <div className="mt-2 border border-t-0 border-slate-400"></div>
          <div className="flex items-center mt-2">
            <p className="w-56">Car amount you can afford:</p>
            <p className="flex flex-1 rounded-md bg-teal-400 p-2 font-bold">
              ₹ {getNumberSystem(loanAmount().total)}
            </p>
          </div>
          <TipsCard list={tipsListCarPlanning} />
        </div>
      </div>
    </Layout>
  );
};

export default Car;
