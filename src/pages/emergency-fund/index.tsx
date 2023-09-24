import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ProgressCard from "@/components/progressCard/ProgressCard";
import LogoBadge from "@/components/badge/LogoBadge";
import { axiosInstance } from "@/api/api";

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
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [savings, setSavings] = useState(0);
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [stability, setStability] = useState(0);
  const [emergencyFund, setEmergencyFund] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchInitData = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "/api/finances/emergency-fund"
      );
      if (status === 200) {
        setMonthlyIncome(data?.monthly_income);
        setSavings(data?.savings);
        setFixedExpenses(data?.total_fixed_expenses);
        setStability(data?.job_stability);
        setEmergencyFund(data?.emergency_fund);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(error?.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  const updateEmergencyApi = async (payload: any) => {
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.put(
        "/api/finances/emergency-fund",
        {
          ...payload,
        }
      );
      if (status === 200) {
        setEmergencyFund(data.emergency_fund);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculateClick = () => {
    if (monthlyIncome & fixedExpenses) {
      const newEmergencyFundPayload = {
        monthly_income: monthlyIncome,
        job_stability: stability,
        total_fixed_expenses: fixedExpenses,
      };
      updateEmergencyApi(newEmergencyFundPayload);
    }
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
              <p className="text-2xl font-bold mr-2">Emergency Fund</p>
              <LogoBadge logo={faSackDollar} color="bg-green-400" />
            </div>
            <p className="text-sm  mt-2">
              Do you think your current Emergency Fund is adequate to protect
              you from financial uncertainities? Check now.
            </p>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                Your monthly income is{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="50000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                value={monthlyIncome.toString()}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                My bank balance + Liquid fund balance is{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="200000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setSavings(Number(e.target.value))}
                value={savings.toString()}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                My monthly fixed expenses is{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="200000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setFixedExpenses(Number(e.target.value))}
                value={fixedExpenses.toString()}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                How much stable is your income?
              </label>
              <select
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                value={stability.toString()}
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
              <Button
                text="Calculate"
                onClick={handleCalculateClick}
                isLoading={isSaving}
                isDisabled={isSaving}
              />
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
        ) : (
          <div>{isError}</div>
        )}
      </div>
    </Layout>
  );
};

export default EmergencyFund;
