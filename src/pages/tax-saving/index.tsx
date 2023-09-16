import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";

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

const TaxSaving = () => {
  const [annualIncome, setAnnualIncome] = useState(0);
  const [epf, setEPF] = useState(0);
  const [lifeInsurancePremium, setLifeInsurancePremium] = useState(0);
  const [elss, setELSS] = useState(0);
  const [fd, setFD] = useState(0);
  const [healthInsurancePremium, setHealthInsurancePremium] = useState(0);
  const [parentHealthInsurancePremium, setParentHealthInsurancePremium] =
    useState(0);
  const [nps, setNPS] = useState(0);

  const handleCalculateClick = () => {
    console.log("saved");
  };

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">Tax Saving</p>
            <LogoBadge logo={faBuildingColumns} color="bg-amber-400" />
          </div>
          <p className="text-sm  mt-2">
            Are you saving the optimum tax? Let's check.
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My annual income is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="500000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
            />
          </div>
          <p className="mt-4 p-2 text-base bg-cyan-100">
            Under 80 C (₹ 1,50,000 max)
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My monthly EPF is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="1700"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setEPF(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My life insurance annual premium is
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="20000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setLifeInsurancePremium(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My monthly investment in ELSS is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setELSS(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My balance in tax saving FD is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setFD(Number(e.target.value))}
            />
          </div>
          <p className="mt-4 p-2 text-base bg-cyan-100">Under 80 D</p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My health insurance annual premium is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="25000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) =>
                setHealthInsurancePremium(Number(e.target.value))
              }
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My parents health insurance annual premium is{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="50000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) =>
                setParentHealthInsurancePremium(Number(e.target.value))
              }
            />
          </div>
          <p className="mt-4 p-2 text-base bg-cyan-100">
            Under 80 CCD(1B) (₹ 50,000 in addition to 80C)
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My investment in NPS is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="200000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setNPS(Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Button text="Calculate" onClick={handleCalculateClick} />
          </div>
          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default TaxSaving;
