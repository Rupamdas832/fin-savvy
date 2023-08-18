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
import { axiosInstance } from "@/api/api";
import { useRouter } from "next/router";

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

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { userId } = query;
  let emergencyFund = {};
  try {
    const { data, status } = await axiosInstance(
      `/api/finances/emergency-fund/?userId=${userId}`
    );
    if (status === 200) {
      emergencyFund = data;
    }
  } catch (error) {
    console.log(error);
  }
  return {
    props: { emergencyFundData: emergencyFund },
  };
}

interface EmergencyFundProps {
  emergencyFundData: {
    emergency_fund: number;
    monthly_income: number;
    job_stability: number;
    savings: number;
    total_fixed_expenses: number;
  };
}
const EmergencyFund = ({ emergencyFundData }: EmergencyFundProps) => {
  const [monthlyIncome, setMonthlyIncome] = useState(
    emergencyFundData?.monthly_income
  );
  const [savings, setSavings] = useState(emergencyFundData?.savings);
  const [fixedExpenses, setFixedExpenses] = useState(
    emergencyFundData?.total_fixed_expenses
  );
  const [stability, setStability] = useState(emergencyFundData?.job_stability);
  const [emergencyFund, setEmergencyFund] = useState(
    emergencyFundData?.emergency_fund
  );
  const [isLoading, setIsLoading] = useState(false);
  const { query } = useRouter();
  const { userId } = query;

  const updateEmergencyApi = async (payload: any) => {
    const origin = window.location.origin;
    try {
      setIsLoading(true);
      const res = await fetch(
        origin + `/api/finances/emergency-fund/?userId=${userId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      setEmergencyFund(data.emergency_fund);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
        <Navbar user_id={userId as string} />
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
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              value={monthlyIncome.toString()}
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
            <label className="font-bold">How much stable is your income?</label>
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
              isLoading={isLoading}
              isDisabled={isLoading}
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
      </div>
    </Layout>
  );
};

export default EmergencyFund;
