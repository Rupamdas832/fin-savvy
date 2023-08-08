import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUp } from "@fortawesome/free-solid-svg-icons";
import { faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/router";

const DashboardHeroBanner = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col p-4">
      <div
        className="flex items-center w-full p-4 rounded-2xl bg-gray-800 cursor-pointer"
        onClick={() => router.push("/savings")}
      >
        <FontAwesomeIcon
          icon={faSackDollar}
          className="text-2xl text-yellow-400"
        />
        <div className="flex flex-col ml-4">
          <p className="text-sm">Total Savings</p>
          <p className="text-base font-bold">Rs 0</p>
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
            <p className="text-base font-bold">Rs 0</p>
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
            <p className="text-base font-bold">Rs 0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeroBanner;
