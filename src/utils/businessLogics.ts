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
