import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import {
  faBuildingColumns,
  faHandPointDown,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import { axiosInstance } from "@/api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProgressCard from "@/components/progressCard/ProgressCard";

const tipsListEmergencyFund = [
  {
    id: 1,
    text: "Don’t forget to buy a term plan if you have any kind of existing debt.",
  },
];

const TaxSaving = () => {
  const [epf, setEPF] = useState(0);
  const [lifeInsurancePremium, setLifeInsurancePremium] = useState(0);
  const [elss, setELSS] = useState(0);
  const [isYourAgeAboveSixty, setIsYourAgeAboveSixty] = useState(false);
  const [isYourParentAgeAboveSixty, setIsYourParentAgeAboveSixty] =
    useState(false);
  const [healthInsurancePremium, setHealthInsurancePremium] = useState(0);
  const [parentHealthInsurancePremium, setParentHealthInsurancePremium] =
    useState(0);
  const [nps, setNPS] = useState(0);
  const [required80C, setRequired80C] = useState(0);
  const [required80D, setRequired80D] = useState(0);
  const [required80CCD, setRequired80CCD] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchInitData = async () => {
    try {
      const { data, status } = await axiosInstance.get(
        "/api/finances/tax-saving"
      );
      if (status === 200) {
        setEPF(data?.monthly_epf);
        setLifeInsurancePremium(data?.life_insurance_premium);
        setELSS(data?.elss_investment);
        setHealthInsurancePremium(data?.health_insurance_premium);
        setParentHealthInsurancePremium(data?.parents_health_insurance_premium);
        setIsYourAgeAboveSixty(data?.is_user_age_above_sixty);
        setIsYourParentAgeAboveSixty(data?.is_parents_age_above_sixty);
        setNPS(data.nps_investment);
        setRequired80C(data?.required_80C_investment);
        setRequired80D(data?.required_80D_investment);
        setRequired80CCD(data?.required_80CCD_investment);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(error?.message as string);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  const updateTaxApi = async (payload: any) => {
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.put(
        "/api/finances/tax-saving",
        {
          ...payload,
        }
      );
      if (status === 200) {
        setRequired80C(data?.required_80C_investment);
        setRequired80D(data?.required_80D_investment);
        setRequired80CCD(data?.required_80CCD_investment);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculateClick = () => {
    const payload = {
      monthly_epf: epf,
      life_insurance_premium: lifeInsurancePremium,
      elss_investment: elss,
      health_insurance_premium: healthInsurancePremium,
      parents_health_insurance_premium: parentHealthInsurancePremium,
      is_user_age_above_sixty: isYourAgeAboveSixty,
      is_parents_age_above_sixty: isYourParentAgeAboveSixty,
      nps_investment: nps,
    };
    updateTaxApi(payload);
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
              <p className="text-2xl font-bold mr-2">Tax Saving</p>
              <LogoBadge logo={faBuildingColumns} color="bg-amber-400" />
            </div>
            <p className="text-sm  mt-2">
              Are you saving the optimum tax? Let's check.
            </p>
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
                value={epf}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                My life insurance annual premium is{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="20000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) =>
                  setLifeInsurancePremium(Number(e.target.value))
                }
                value={lifeInsurancePremium}
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
                value={elss}
              />
            </div>
            <p className="mt-4 p-2 text-base bg-cyan-100">Under 80 D</p>
            <div className="flex mt-4">
              <label className="font-bold">Your age is above 60?</label>
              <div className="ml-2">
                <input
                  type="radio"
                  name="your_age"
                  value="HTML"
                  checked={!isYourAgeAboveSixty}
                  onChange={() => setIsYourAgeAboveSixty(false)}
                />
                <label className="ml-2">No</label>
              </div>
              <div className="ml-2">
                <input
                  type="radio"
                  name="your_age"
                  value="CSS"
                  checked={isYourAgeAboveSixty}
                  onChange={() => setIsYourAgeAboveSixty(true)}
                />
                <label className="ml-2">Yes</label>
              </div>
            </div>
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
                value={healthInsurancePremium}
              />
            </div>
            <div className="flex mt-4">
              <label className="font-bold">Your parents age is above 60?</label>
              <div className="ml-2">
                <input
                  type="radio"
                  name="parent_age"
                  value="HTML"
                  checked={!isYourParentAgeAboveSixty}
                  onChange={() => setIsYourParentAgeAboveSixty(false)}
                />
                <label className="ml-2">No</label>
              </div>
              <div className="ml-2">
                <input
                  type="radio"
                  name="parent_age"
                  value="CSS"
                  checked={isYourParentAgeAboveSixty}
                  onChange={() => setIsYourParentAgeAboveSixty(true)}
                />
                <label className="ml-2">Yes</label>
              </div>
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
                value={parentHealthInsurancePremium}
              />
            </div>
            <p className="mt-4 p-2 text-base bg-cyan-100">
              Under 80 CCD(1B) (₹ 50,000 in addition to 80C)
            </p>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                My investment in NPS is{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="200000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setNPS(Number(e.target.value))}
                value={nps}
              />
            </div>
            <div className="mt-4">
              <Button
                text="Calculate"
                onClick={handleCalculateClick}
                isDisabled={isSaving}
                isLoading={isSaving}
              />
            </div>
            {(required80C > 0 || required80D > 0 || required80CCD > 0) && (
              <div className="flex mt-4">
                <p className="text-2xl font-bold">Problem Analysis</p>
                <FontAwesomeIcon
                  icon={faHandPointDown}
                  className="text-2xl ml-2 text-yellow-500"
                />
              </div>
            )}
            <div className="mt-4">
              <ProgressCard
                logo={faBuildingColumns}
                title="80C"
                currentValue={150000 - required80C}
                totalValue={150000}
              />
            </div>
            <div className="mt-4">
              <ProgressCard
                logo={faBuildingColumns}
                title="80D"
                currentValue={required80D}
                totalValue={
                  (isYourAgeAboveSixty ? 50000 : 25000) +
                  (isYourParentAgeAboveSixty ? 50000 : 25000)
                }
              />
            </div>
            <div className="mt-4">
              <ProgressCard
                logo={faBuildingColumns}
                title="80CCD"
                currentValue={50000 - required80CCD}
                totalValue={50000}
              />
            </div>
            <TipsCard list={tipsListEmergencyFund} />
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default TaxSaving;
