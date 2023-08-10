import { UserType } from "@/types/user.type";

const users: UserType[] = [
  {
    user_id: "1",
    first_name: "Rupam",
    last_name: "Das",
    user_name: "rupamDas832",
    email: "rupamdas@gmail.com",
    address: {
      street: "Kulas Light",
      suite: "Apt. 556",
      city: "Jamshedpur",
      pincode: 831002,
    },
    phone: 9876543210,
    finances: {
      monthly_income: 100000,
      fixed_expenses: 35000,
      bank_balance: 200000,
    },
  },
  {
    user_id: "2",
    first_name: "Ervin",
    last_name: "Howell",
    user_name: "Antonette",
    email: "Shanna@melissa.tv",
    address: {
      street: "Victor Plains",
      suite: "Suite 879",
      city: "Wisokyburgh",
      pincode: 90566,
    },
    phone: 9876543210,
    finances: {
      monthly_income: 0,
      fixed_expenses: 0,
      bank_balance: 0,
    },
  },
];

export default users;
