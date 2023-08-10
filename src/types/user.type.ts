export type UserType = {
  user_id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    pincode: number;
  };
  phone: number;
  finances: {
    monthly_income: number;
    fixed_expenses: number;
    bank_balance: number;
  };
};
