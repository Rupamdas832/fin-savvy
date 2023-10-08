import LogoBadge from "@/components/badge/LogoBadge";
import {
  faCircleDown,
  faShieldHalved,
  faHandHoldingDollar,
  faBuildingColumns,
  faSackDollar,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from "react";

const initSteps = [
  {
    id: "1",
    title: "Add your savings",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-400",
    logo: faSackDollar,
    status: "DONE",
  },
  {
    id: "2",
    title: "Add your fixed expenses",
    borderColor: "border-red-400",
    bgColor: "bg-red-400",
    logo: faCircleDown,
    status: "PENDING",
  },
  {
    id: "3",
    title: "Do you have emergency fund?",
    borderColor: "border-green-400",
    bgColor: "bg-green-400",
    logo: faSackDollar,
    status: "DONE",
  },
  {
    id: "4",
    title: "Are you insured?",
    borderColor: "border-pink-400",
    bgColor: "bg-pink-400",
    logo: faShieldHalved,
    status: "PENDING",
  },
  {
    id: "5",
    title: "Dont be in a debt trap!",
    borderColor: "border-cyan-400",
    bgColor: "bg-cyan-400",
    logo: faHandHoldingDollar,
    status: "PENDING",
  },
  {
    id: "6",
    title: "Save in taxes",
    borderColor: "border-amber-400",
    bgColor: "bg-amber-400",
    logo: faBuildingColumns,
    status: "PENDING",
  },
];

const ChecklistBanner = () => {
  const [steps, setSteps] = useState(initSteps);
  const router = useRouter();
  return (
    <div className="flex flex-col p-4 text-black">
      <p className="text-base font-bold">
        Here's your Personal Finance checklist
      </p>
      <div className="flex flex-col mt-4 relative">
        {steps.map((step) => {
          return (
            <div
              key={step.id}
              className={`z-10 ${step.id === "1" ? "mt-0" : "mt-4"}`}
            >
              {step.status === "DONE" ? (
                <div className="flex items-center ml-2">
                  <div className="flex items-center justify-center h-5 w-5 rounded-full bg-green-600">
                    <div className="flex items-center justify-center h-4 w-4 rounded-full bg-white">
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-xs text-green-600"
                      />
                    </div>
                  </div>
                  <p className="text-base font-semibold line-through ml-2">
                    {step.title}
                  </p>
                </div>
              ) : (
                <div
                  className={`flex justify-between p-2 h-12 bg-white border border-spacing-1 ${step.borderColor} border-b-4 rounded-full`}
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-4 w-4 rounded-full bg-black">
                      <div className="h-3.5 w-3.5 rounded-full bg-white"></div>
                    </div>
                    <p className="text-base font-semibold ml-2">{step.title}</p>
                  </div>
                  <LogoBadge logo={step.logo} color={step.bgColor} />
                </div>
              )}
            </div>
          );
        })}
        <div className="border border-spacing-1 border-dashed border-slate-700 absolute top-1 left-4 h-full"></div>
      </div>
    </div>
  );
};

export default ChecklistBanner;
