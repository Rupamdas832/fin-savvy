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
