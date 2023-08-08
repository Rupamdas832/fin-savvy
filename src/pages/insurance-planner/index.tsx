import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import ProgressCard from "@/components/progressCard/ProgressCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const tipsListEmergencyFund = [
  {
    id: 1,
    text: "You are 1 medical bill away to become financially broke if you dont have health insurance.",
  },
  {
    id: 2,
    text: "Buy an insurance policy at a young age, if you want to avoid paying a higher premium.",
  },
  {
    id: 3,
    text: "Avoid buying life insurance as an investment or as a retirement planning avenue.",
  },
  {
    id: 4,
    text: "Ensure that you have life insurance protection at least until your retirement.",
  },
  {
    id: 5,
    text: "Provide accurate disclosures of your medical history and personal habits while applying for insurance policies.",
  },
];

const InsurancePlanner = () => {
  const [annualIncome, setAnnualIncome] = useState(0);
  const [lifeCover, setLifeCover] = useState(0);
  const [criticalIllnessCover, setCriticalIllnessCover] = useState(0);
  const [accidentalCover, setAccidentalCover] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [healthCover, setHealthCover] = useState(0);
  const [requiredLifeCover, setRequiredLifeCover] = useState(0);
  const [requiredCriticalIllnessCover, setRequiredCriticalIllnessCover] =
    useState(0);
  const [requiredAccidentalCover, setRequiredAccidentalCover] = useState(0);
  const [requiredHealthCover, setRequiredHealthCover] = useState(0);

  const handleCalculateClick = () => {
    if (!annualIncome) return;
    const life = annualIncome * 10 + loanAmount;
    setRequiredLifeCover(life);
    const health = 500000;
    setRequiredHealthCover(health);
    const critical = 3000000;
    setRequiredCriticalIllnessCover(critical);
    const accidental = annualIncome * 10;
    setRequiredAccidentalCover(accidental);
  };

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold mr-2">Insurance Planner</p>
            <LogoBadge logo={faShieldHalved} color="bg-pink-400" />
          </div>
          <p className="text-sm  mt-2">
            Do you think your current life & health insurance coverage is
            enough? Let's Find Out.
          </p>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              My annual income is <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="10,00,000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setAnnualIncome(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              I have a life cover of <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="1,00,00,000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setLifeCover(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              With critical illness cover of{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="20,00,000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setCriticalIllnessCover(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              And accidental cover of <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="20,00,000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setAccidentalCover(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              I have to repay a loan of{" "}
              <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="12,00,000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">
              I have health cover of <span className="text-gray-400">Rs.</span>
            </label>
            <input
              placeholder="5,00,000"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
              type="number"
              onChange={(e) => setHealthCover(Number(e.target.value))}
            />
          </div>
          <div className="mt-4">
            <Button text="Save" onClick={handleCalculateClick} />
          </div>
          {(requiredLifeCover > 0 ||
            requiredHealthCover > 0 ||
            requiredCriticalIllnessCover > 0 ||
            requiredAccidentalCover > 0) && (
            <div className="flex mt-4">
              <p className="text-2xl font-bold">Problem Analysis</p>
              <FontAwesomeIcon
                icon={faHandPointDown}
                className="text-2xl ml-2 text-yellow-500"
              />
            </div>
          )}
          {requiredLifeCover !== 0 && (
            <div className="mt-4">
              <ProgressCard
                logo={faShieldHalved}
                title="Life Cover"
                currentValue={lifeCover}
                totalValue={requiredLifeCover}
              />
            </div>
          )}
          {requiredCriticalIllnessCover !== 0 && (
            <div className="mt-4">
              <ProgressCard
                logo={faShieldHalved}
                title="Critical Illness Cover"
                currentValue={criticalIllnessCover}
                totalValue={requiredCriticalIllnessCover}
              />
            </div>
          )}
          {requiredAccidentalCover !== 0 && (
            <div className="mt-4">
              <ProgressCard
                logo={faShieldHalved}
                title="Accidental Cover"
                currentValue={accidentalCover}
                totalValue={requiredAccidentalCover}
              />
            </div>
          )}
          {requiredHealthCover !== 0 && (
            <div className="my-4">
              <ProgressCard
                logo={faShieldHalved}
                title="Health Insurance"
                currentValue={healthCover}
                totalValue={requiredHealthCover}
              />
            </div>
          )}
          <TipsCard list={tipsListEmergencyFund} />
        </div>
      </div>
    </Layout>
  );
};

export default InsurancePlanner;
