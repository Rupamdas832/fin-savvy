import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import { SavingType } from "@/types/finance.type";
import { useRouter } from "next/router";
import { UserType } from "@/types/user.type";
import { originUrl } from "@/api/api";

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

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { userId } = query;
  let savingsData = {};
  let usersData = {};
  try {
    const res = await fetch(
      originUrl + `/api/finances/savings/?userId=${userId}`
    );
    savingsData = await res.json();
  } catch (error) {
    console.log(error);
  }
  try {
    const res = await fetch(originUrl + `/api/users/?userId=${userId}`);
    usersData = await res.json();
  } catch (error) {
    console.log(error);
  }
  return {
    props: { savings: savingsData, user: usersData },
  };
}

interface SavingsProps {
  savings: SavingType;
  user: UserType;
}

const Savings = ({ savings, user }: SavingsProps) => {
  const [bankBalance, setBankBalance] = useState(savings.bank_balance);
  const [fdBalance, setFDBalance] = useState(savings.fd_balance);
  const [equityBalance, setEquityBalance] = useState(savings.equity_balance);
  const [goldBalance, setGoldBalance] = useState(savings.gold_balance);
  const [totalSavings, setTotalSavings] = useState(savings.total_savings);
  const { query } = useRouter();
  const { userId } = query;

  const updateSavingsApi = async (payload: SavingType) => {
    const origin = window.location.origin;
    try {
      const res = await fetch(
        origin + `/api/finances/savings/?userId=${userId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.status === 200) {
        setTotalSavings(data.total_savings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCalculateClick = () => {
    const total_savings = bankBalance + fdBalance + equityBalance + goldBalance;

    const newSavings: SavingType = {
      ...savings,
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
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <Navbar user_id={user.user_id} first_name={user.first_name} />
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
              value={bankBalance.toString()}
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
              value={fdBalance.toString()}
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
              value={equityBalance.toString()}
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
            <Button text="Save" onClick={handleCalculateClick} />
          </div>
          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default Savings;
