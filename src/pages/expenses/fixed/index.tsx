import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import ProgressCard from "@/components/progressCard/ProgressCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const FixedExpenses = () => {
  const [income, setIncome] = useState(0);
  const [houseRent, setHouseRent] = useState(0);
  const [electricityBill, setElectricityBill] = useState(0);
  const [utilityBills, setUtilityBills] = useState(0);
  const [groceryBills, setGroceryBills] = useState(0);
  const [commuteBills, setCommuteBills] = useState(0);
  const [emi, setEMI] = useState(0);
  const [ottBills, setOTTBills] = useState(0);
  const [parentDonation, setParentDonation] = useState(0);
  const [otherBills, setOtherBills] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const handleCalculateClick = () => {
    const expenses =
      houseRent +
      electricityBill +
      utilityBills +
      groceryBills +
      commuteBills +
      emi +
      ottBills +
      parentDonation +
      otherBills;
    setTotalExpenses(expenses);
    window.scrollTo(0, 0);
  };
  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">Fixed Expenses</p>
            <LogoBadge logo={faArrowDown} color="bg-red-400" />
          </div>
          <p className="text-sm  mt-2">
            Expenses: ₹{" "}
            <span className="text-base font-bold">{totalExpenses}</span>
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My monthly income is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="100000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My monthly house rent is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="10000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setHouseRent(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              With electricity bill of{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="300"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setElectricityBill(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              And other utility bills is{" "}
              <span className="text-sm">(Gas/Internet/Mobile)</span>{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="500"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setUtilityBills(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My monthly expenditure in food & groceries is (approx){" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="5000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setGroceryBills(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My monthly commute charges is (approx){" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="5000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setCommuteBills(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My total monthly EMIs is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="10000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setEMI(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My monthly OTT subscription charges is{" "}
              <span className="text-sm">(Netflix/Hotstar/Zee)</span>{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="500"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setOTTBills(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              I give back to my parent{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="5000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setParentDonation(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              Other fixed charges <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="1000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setOtherBills(Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Button text="Calculate" onClick={handleCalculateClick} />
          </div>
          {totalExpenses > 0 && (
            <div className="mt-4">
              <div className="flex">
                <p className="text-2xl font-bold">Problem Analysis</p>
                <FontAwesomeIcon
                  icon={faHandPointDown}
                  className="text-2xl ml-2 text-yellow-500"
                />
              </div>
              <p className="my-2 text-base bg-cyan-100 p-2">
                Recommended to keep your expense ratio below 50%
              </p>
              <ProgressCard
                currentValue={totalExpenses}
                totalValue={income}
                title="Expenses ratio"
                logo={faArrowDown}
              />
            </div>
          )}
          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default FixedExpenses;
