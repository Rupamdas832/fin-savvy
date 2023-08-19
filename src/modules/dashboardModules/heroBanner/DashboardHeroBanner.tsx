import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";
import { faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { UserType } from "@/types/user.type";
import { FinanceType } from "@/types/finance.type";
import { ExpenseType } from "@/types/expenses.type";
import { useMemo } from "react";

interface DashboardHeroBannerProps {
  user: UserType;
  finance: FinanceType;
  expenses: ExpenseType[];
}

const DashboardHeroBanner = ({
  user,
  finance,
  expenses,
}: DashboardHeroBannerProps) => {
  const router = useRouter();

  const totalCurrentExpenses = useMemo(() => {
    return expenses.reduce((acum, curr) => acum + curr.amount, 0);
  }, [expenses]);

  return (
    <div className="flex flex-col p-4">
      <div
        className="flex items-center w-full p-4 rounded-2xl bg-gray-800 cursor-pointer"
        onClick={() => router.push(`/savings/?userId=${user.user_id}`)}
      >
        <FontAwesomeIcon
          icon={faSackDollar}
          className="text-2xl text-yellow-400"
        />
        <div className="flex flex-col ml-4">
          <p className="text-sm">Total Savings</p>
          <p className="text-base font-bold">₹ {finance?.total_savings}</p>
        </div>
      </div>
      <div className="flex justify-between gap-4 mt-4">
        <div className="flex flex-1 items-center p-4 rounded-2xl bg-gray-800">
          <FontAwesomeIcon
            icon={faCircleUp}
            className="text-2xl text-lime-600"
          />
          <div className="flex flex-col ml-4">
            <p className="text-sm">Income</p>
            <p className="text-base font-bold">₹ {finance?.monthly_income}</p>
          </div>
        </div>
        <div
          className="flex flex-1 items-center p-4 rounded-2xl bg-gray-800 cursor-pointer"
          onClick={() => router.push(`/expenses/?userId=${user.user_id}`)}
        >
          <FontAwesomeIcon
            icon={faCircleDown}
            className="text-2xl text-red-600"
          />
          <div className="flex flex-col ml-4">
            <p className="text-sm">Expenses</p>
            <p className="text-base font-bold">
              ₹ {finance?.total_fixed_expenses + totalCurrentExpenses}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeroBanner;
