import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import {
  faHandPointDown,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import { axiosInstance } from "@/api/api";
import { DebtType } from "@/types/finance.type";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProgressCard from "@/components/progressCard/ProgressCard";

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

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { userId } = query;
  let debtData = {};
  try {
    const { data, status } = await axiosInstance.get(
      `/api/finances/debt-diagnosis/?userId=${userId}`
    );
    if (status === 200) {
      debtData = data;
    }
  } catch (error) {
    console.log(error);
  }
  return {
    props: { debtData: debtData },
  };
}

interface IDebt {
  debtData: DebtType;
}

const DebtDiagnosis = ({ debtData }: IDebt) => {
  const [monthlyIncome, setMontlyIncome] = useState(debtData?.monthly_income);
  const [loan, setLoan] = useState(debtData?.total_loan_amount);
  const [emi, setEMI] = useState(debtData?.total_emi);
  const [totalSavings, setTotalSavings] = useState(debtData?.total_savings);
  const [emiLoad, setEmiLoad] = useState(debtData?.emi_load);
  const [isLoading, setIsLoading] = useState(false);

  const { query } = useRouter();
  const { userId } = query;

  const updateDebtApi = async (payload: any) => {
    const origin = window.location.origin;
    try {
      setIsLoading(true);
      const res = await fetch(
        origin + `/api/finances/debt-diagnosis/?userId=${userId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setEmiLoad(data.emi_load);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculateClick = () => {
    if (!monthlyIncome) return;

    const payload = {
      monthly_income: monthlyIncome,
      total_emi: emi,
      total_loan_amount: loan,
      total_savings: totalSavings,
    };
    updateDebtApi(payload);
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
              value={monthlyIncome?.toString()}
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
              value={loan?.toString()}
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
              value={emi?.toString()}
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
              value={totalSavings?.toString()}
            />
          </div>
          <div className="mt-4">
            <Button
              text="Calculate"
              onClick={handleCalculateClick}
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </div>
          <div className="mt-4">
            <div className="flex">
              <p className="text-2xl font-bold">Problem Analysis</p>

              <FontAwesomeIcon
                icon={faHandPointDown}
                className="text-2xl ml-2 text-yellow-500"
              />
            </div>
            <p className="my-2 text-base bg-cyan-100 p-2">
              Recommended to keep your emi load below 28%
            </p>
            <div className="my-4">
              <ProgressCard
                logo={faSackDollar}
                title="EMI load"
                currentValue={emiLoad}
                totalValue={100}
              />
            </div>
          </div>

          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default DebtDiagnosis;
