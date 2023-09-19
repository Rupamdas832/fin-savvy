import { TaxSavingType } from "@/types/finance.type";

interface CalculateEmergencyFundProps {
  total_fixed_expenses: number;
  monthly_income: number;
  job_stability: number;
}
export const calculateEmergencyFund = (props: CalculateEmergencyFundProps) => {
  const requiredFund =
    props?.total_fixed_expenses * 6 +
    props.monthly_income * (3 / props.job_stability);

  return requiredFund;
};

interface CalculateDebtLoadProps {
  monthly_income: number;
  total_emi: number;
  total_loan_amount: number;
  total_savings: number;
}

export const calculateDebtLoad = (props: CalculateDebtLoadProps) => {
  if (!props.monthly_income) return 0;
  const load = (props.total_emi / props.monthly_income) * 100;
  return Number(load.toFixed(0));
};

export const calculateLoanAmountOfMonthlyEmi = (
  interest: number,
  loanTenure: number,
  monthlyEMI: number
) => {
  const monthlyInterest = interest / 12;
  const powerValue = Math.pow(1 + monthlyInterest / 100, loanTenure * 12);
  const result =
    (monthlyEMI * (powerValue - 1)) / ((monthlyInterest * powerValue) / 100);

  return Number(result.toFixed(0));
};

export const calculateTaxBenefit = (payload: TaxSavingType) => {
  const required_80C_investment =
    150000 -
    (payload.monthly_epf + payload.elss_investment) * 12 -
    payload.life_insurance_premium;
  const required_80D_investment =
    (payload.is_user_age_above_sixty
      ? 50000 - payload.health_insurance_premium
      : 25000 - payload.health_insurance_premium) +
    (payload.is_parents_age_above_sixty
      ? 50000 - payload.parents_health_insurance_premium
      : 25000 - payload.parents_health_insurance_premium);
  const required_80CCD_investment = 50000 - payload.nps_investment;

  return {
    required_80C_investment:
      required_80C_investment > 0 ? required_80C_investment : 0,
    required_80D_investment:
      required_80D_investment > 0 ? required_80D_investment : 0,
    required_80CCD_investment:
      required_80CCD_investment > 0 ? required_80CCD_investment : 0,
  };
};
