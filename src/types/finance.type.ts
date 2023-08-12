export type ExpenseType = {
  house_rent: number;
  electricity_bill: number;
  utility_bill: number;
  commute_bill: number;
  ott_bill: number;
  parent_donation: number;
  other_bill: number;
  total_fixed_expenses: number;
};

export type SavingType = {
  bank_balance: number;
  fd_balance: number;
  equity_balance: number;
  gold_balance: number;
  total_savings: number;
};

export type InsuranceType = {
  life_insurance_cover: number;
  critical_illness_cover: number;
  accidental_death_cover: number;
  health_insurance_cover: number;
  required__life_insurance_cover: number;
  required_critical_illness_cover: number;
  required_accidental_death_cover: number;
  required_health_insurance_cover: number;
};

export type DebtType = {
  total_emi: number;
  total_loan_amount: number;
};

export type FinanceType = {
  user_finance_id: string;
  user_id: string;
  fixed_expenses: ExpenseType;
  savings: SavingType;
  insurance: InsuranceType;
  debt: DebtType;
  emergency_fund: number;
  monthly_income: number;
  job_stability: number;
};
