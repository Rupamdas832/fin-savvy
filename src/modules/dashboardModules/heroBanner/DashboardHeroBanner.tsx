import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";
import { faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { UserType } from "@/types/user.type";

interface DashboardHeroBannerProps {
  user: UserType;
}

const DashboardHeroBanner = ({ user }: DashboardHeroBannerProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col p-4">
      <div
        className="flex items-center w-full p-4 rounded-2xl bg-gray-800 cursor-pointer"
        onClick={() => router.push(`/savings/${user.user_id}`)}
      >
        <FontAwesomeIcon
          icon={faSackDollar}
          className="text-2xl text-yellow-400"
        />
        <div className="flex flex-col ml-4">
          <p className="text-sm">Total Savings</p>
          <p className="text-base font-bold">₹ {user.finances.bank_balance}</p>
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
            <p className="text-base font-bold">
              ₹ {user.finances.monthly_income}
            </p>
          </div>
        </div>
        <div
          className="flex flex-1 items-center p-4 rounded-2xl bg-gray-800 cursor-pointer"
          onClick={() => router.push("/expenses")}
        >
          <FontAwesomeIcon
            icon={faCircleDown}
            className="text-2xl text-red-600"
          />
          <div className="flex flex-col ml-4">
            <p className="text-sm">Expenses</p>
            <p className="text-base font-bold">
              ₹ {user.finances.fixed_expenses}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeroBanner;
