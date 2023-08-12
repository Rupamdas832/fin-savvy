import { FinanceType } from "@/types/finance.type";

const finance: FinanceType[] = [
  {
    user_finance_id: "1",
    user_id: "1",
    fixed_expenses: {
      house_rent: 0,
      electricity_bill: 0,
      utility_bill: 0,
      food_bill: 0,
      commute_bill: 0,
      ott_bill: 0,
      parent_donation: 0,
      other_bill: 0,
      total_fixed_expenses: 0,
    },
    savings: {
      bank_balance: 0,
      fd_balance: 0,
      equity_balance: 0,
      gold_balance: 0,
      total_savings: 0,
    },
    insurance: {
      life_insurance_cover: 0,
      critical_illness_cover: 0,
      accidental_death_cover: 0,
      health_insurance_cover: 0,
      required__life_insurance_cover: 0,
      required_critical_illness_cover: 0,
      required_accidental_death_cover: 0,
      required_health_insurance_cover: 0,
    },
    debt: {
      total_emi: 0,
      total_loan_amount: 0,
    },
    emergency_fund: 0,
    monthly_income: 0,
    job_stability: 3,
  },
];

export default finance;
