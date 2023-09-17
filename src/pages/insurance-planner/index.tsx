import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { faHandPointDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import ProgressCard from "@/components/progressCard/ProgressCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosInstance } from "@/api/api";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);

  const fetchInitData = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "/api/finances/insurance-planner"
      );
      if (status === 200) {
        setAnnualIncome(data?.monthly_income * 12);
        setLifeCover(data?.life_insurance_cover);
        setCriticalIllnessCover(data?.critical_illness_cover);
        setAccidentalCover(data?.accidental_death_cover);
        setLoanAmount(data?.total_loan_amount);
        setHealthCover(data?.health_insurance_cover);
        setRequiredLifeCover(data?.required__life_insurance_cover);
        setRequiredCriticalIllnessCover(data?.required_critical_illness_cover);
        setRequiredAccidentalCover(data?.required_accidental_death_cover);
        setRequiredHealthCover(data?.required_health_insurance_cover);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  const updateInsuranceApi = async (payload: any) => {
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.put(
        "/api/finances/insurance-planner",
        {
          ...payload,
        }
      );
      if (status === 200) {
        setRequiredLifeCover(data.required__life_insurance_cover);
        setRequiredHealthCover(data.required_health_insurance_cover);
        setRequiredCriticalIllnessCover(data.required_critical_illness_cover);
        setRequiredAccidentalCover(data.required_accidental_death_cover);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculateClick = () => {
    if (!annualIncome) return;

    const payload = {
      life_insurance_cover: lifeCover,
      critical_illness_cover: criticalIllnessCover,
      accidental_death_cover: accidentalCover,
      health_insurance_cover: healthCover,
      total_loan_amount: loanAmount,
      monthly_income: annualIncome / 12,
    };
    updateInsuranceApi(payload);
  };

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-screen">
            <p>Loading...</p>
          </div>
        ) : !isError ? (
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
                value={annualIncome?.toString()}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                I have a life cover of{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="1,00,00,000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setLifeCover(Number(e.target.value))}
                value={lifeCover?.toString()}
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
                onChange={(e) =>
                  setCriticalIllnessCover(Number(e.target.value))
                }
                value={criticalIllnessCover?.toString()}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                And accidental cover of{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="20,00,000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setAccidentalCover(Number(e.target.value))}
                value={accidentalCover?.toString()}
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
                value={loanAmount?.toString()}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                I have health cover of{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="5,00,000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setHealthCover(Number(e.target.value))}
                value={healthCover?.toString()}
              />
            </div>
            <div className="mt-4">
              <Button
                text="Save"
                onClick={handleCalculateClick}
                isDisabled={isSaving}
                isLoading={isSaving}
              />
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
        ) : (
          <div>{isError}</div>
        )}
      </div>
    </Layout>
  );
};

export default InsurancePlanner;
