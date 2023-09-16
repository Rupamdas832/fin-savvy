import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import { SavingType } from "@/types/finance.type";
import { axiosInstance } from "@/api/api";
import { getNumberSystem } from "@/utils/general";

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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.get("/api/finances/savings");
      if (status === 200) {
        setBankBalance(data?.bank_balance);
        setFDBalance(data?.fd_balance);
        setEquityBalance(data?.equity_balance);
        setGoldBalance(data?.gold_balance);
        setTotalSavings(data?.total_savings);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSavingsApi = async (payload: SavingType) => {
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.put(
        "/api/finances/savings",
        {
          ...payload,
        }
      );
      if (status === 200) {
        setTotalSavings(data.total_savings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculateClick = () => {
    const total_savings = bankBalance + fdBalance + equityBalance + goldBalance;

    const newSavings: SavingType = {
      bank_balance: bankBalance,
      fd_balance: fdBalance,
      equity_balance: equityBalance,
      gold_balance: goldBalance,
      total_savings: total_savings,
    };
    updateSavingsApi(newSavings);
  };
  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <p>Loading...</p>
        </div>
      ) : !isError ? (
        <div className="flex flex-col w-full min-h-screen bg-white text-black">
          <div className="flex flex-col p-4">
            <div className="flex items-center">
              <p className="text-2xl font-bold mr-2">Total Savings</p>
              <LogoBadge logo={faSackDollar} color="bg-yellow-400" />
            </div>
            <p className="text-sm  mt-2">
              Savings: ₹{" "}
              <span className="text-base font-bold">
                {getNumberSystem(totalSavings)}
              </span>
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
                value={bankBalance?.toString()}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                My total FD balance is{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="200000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setFDBalance(Number(e.target.value))}
                value={fdBalance?.toString()}
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
                value={equityBalance?.toString()}
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
                value={goldBalance.toString()}
              />
            </div>
            <div className="mt-4">
              <Button
                text="Save"
                onClick={handleCalculateClick}
                isLoading={isSaving}
                isDisabled={isSaving}
              />
            </div>
            <TipsCard list={tipsListEmergencyFund} />
          </div>
        </div>
      ) : (
        <div>{isError}</div>
      )}
    </Layout>
  );
};

export default Savings;
