import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import ProgressCard from "@/components/progressCard/ProgressCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FixedExpenseType } from "@/types/finance.type";
import { axiosInstance, originUrl } from "@/api/api";

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

interface IFixedExpense extends FixedExpenseType {
  monthly_income: number;
  total_emi: number;
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const fetchInitData = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "/api/finances/fixed-expenses"
      );
      if (status === 200) {
        setIncome(data?.monthly_income);
        setHouseRent(data?.house_rent);
        setElectricityBill(data?.electricity_bill);
        setUtilityBills(data?.utility_bill);
        setGroceryBills(data?.food_bill);
        setCommuteBills(data?.commute_bill);
        setEMI(data?.total_emi);
        setOTTBills(data?.ott_bill);
        setParentDonation(data?.parent_donation);
        setOtherBills(data?.other_bill);
        setTotalExpenses(data?.total_fixed_expenses);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  const updateExpenseApi = async (payload: IFixedExpense) => {
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.put(
        "/api/finances/fixed-expenses",
        {
          ...payload,
        }
      );
      if (status === 200) {
        setTotalExpenses(data.total_fixed_expenses);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculateClick = () => {
    const _totalExpense =
      houseRent +
      electricityBill +
      utilityBills +
      groceryBills +
      commuteBills +
      emi +
      ottBills +
      parentDonation +
      otherBills;

    const payload: IFixedExpense = {
      monthly_income: income,
      house_rent: houseRent,
      electricity_bill: electricityBill,
      utility_bill: utilityBills,
      food_bill: groceryBills,
      commute_bill: commuteBills,
      total_emi: emi,
      ott_bill: ottBills,
      parent_donation: parentDonation,
      other_bill: otherBills,
      total_fixed_expenses: _totalExpense,
    };
    updateExpenseApi(payload);
  };

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-screen">
            <p>Loading...</p>
          </div>
        ) : !isError ? (
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
                value={income.toString()}
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
                value={houseRent.toString()}
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
                value={electricityBill.toString()}
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
                value={utilityBills.toString()}
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
                value={groceryBills.toString()}
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
                value={commuteBills.toString()}
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
                value={emi.toString()}
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
                value={ottBills.toString()}
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
                value={parentDonation.toString()}
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
                value={otherBills.toString()}
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
        ) : (
          <div>{isError}</div>
        )}
      </div>
    </Layout>
  );
};

export default FixedExpenses;
