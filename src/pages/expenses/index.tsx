import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import Button from "@/components/button/Button";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "@/components/modal/Modal";
import { useRouter } from "next/router";
import { axiosInstance } from "@/api/api";
import { ExpenseType } from "@/types/expenses.type";

const expenseCategory = [
  {
    expense_category_id: "1",
    title: "Grocery",
    logo: faBasketShopping,
    color: "bg-lime-300",
  },
  {
    expense_category_id: "2",
    title: "Shopping",
    logo: faCartShopping,
    color: "bg-pink-300",
  },
  {
    expense_category_id: "3",
    title: "Travel",
    logo: faCar,
    color: "bg-blue-300",
  },
  {
    expense_category_id: "4",
    title: "Restaurants & Bars",
    logo: faChampagneGlasses,
    color: "bg-amber-300",
  },
  {
    expense_category_id: "5",
    title: "Education",
    logo: faGraduationCap,
    color: "bg-purple-300",
  },
  {
    expense_category_id: "6",
    title: "Bills",
    logo: faReceipt,
    color: "bg-yellow-300",
  },
];

const getCategory = (id: string) => {
  return expenseCategory.find((item) => item.expense_category_id === id);
};

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { userId } = query;
  let expensesData = [];

  try {
    const { data, status } = await axiosInstance.get(
      `/api/expenses/?userId=${userId}`
    );
    if (status === 200) {
      expensesData = data;
    }
  } catch (error) {
    console.log(error);
  }
  return {
    props: { expenses: expensesData },
  };
}

interface ExpensesProps {
  expenses: ExpenseType[];
}

const Expenses = ({ expenses }: ExpensesProps) => {
  const [title, setTitle] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [amount, setAmount] = useState(0);
  const [createdAt, setCreatedAt] = useState("");
  const [expenseList, setExpenseList] = useState(expenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { query } = router;
  const { userId } = query;

  const postNewExpense = async (payload: ExpenseType) => {
    const origin = window.location.origin;
    try {
      setIsLoading(true);
      const res = await fetch(origin + `/api/expenses`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.status === 200) {
        setExpenseList((expenseList) => [...expenseList, data]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      handleResetModal();
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    if (title && expenseCategoryId && amount) {
      const newExpense: ExpenseType = {
        user_id: userId as string,
        expense_id: `${expenseList.length + 1}`,
        description: title,
        expense_category_id: expenseCategoryId,
        amount,
        created_at: createdAt,
      };
      postNewExpense(newExpense);
    }
  };

  const handleResetModal = () => {
    setTitle("");
    setAmount(0);
    setExpenseCategoryId("");
    setCreatedAt("");
    setIsModalOpen(false);
  };

  const totalExpense = useMemo(() => {
    return expenseList.reduce((accu, curr) => accu + curr.amount, 0);
  }, [expenseList]);

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <Navbar />
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-2xl font-bold mr-2">Expenses</p>
              <LogoBadge logo={faArrowDown} color="bg-red-400" />
            </div>
            <Button
              text="Fixed expenses"
              onClick={() => router.push(`/expenses/fixed/?userId=${userId}`)}
            />
          </div>
          <p className="text-sm  mt-2">
            Total: ₹ <span className="text-base font-bold">{totalExpense}</span>
          </p>
          <div className="flex justify-between p-4 mt-4 rounded-xl shadow-md shadow-slate-400">
            <div>
              <p className="text-base font-bold">Add new expense</p>
              <p className="text-sm">Track better by adding expenses.</p>
            </div>
            <button
              className="flex items-center justify-center px-4 py-2 bg-slate-200 border-none rounded-xl"
              onClick={() => setIsModalOpen(true)}
            >
              <FontAwesomeIcon
                icon={faPlus}
                className="text-xl font-extrabold text-black"
              />
            </button>
          </div>
          {expenseList.length === 0 && (
            <p className="text-xl font-bold text-center mt-8">
              No expenses yet!
            </p>
          )}
          <div className="flex flex-col-reverse mt-4">
            {expenseList.map((expense) => {
              const category = getCategory(expense.expense_category_id);
              return (
                <div
                  className="flex justify-between w-full p-2 mt-2 rounded-xl"
                  key={expense.expense_id}
                >
                  <div className="flex items-center w-3/5">
                    <LogoBadge logo={category?.logo} color={category?.color} />
                    <div className="flex flex-col flex-1 ml-2">
                      <p className="text-base font-bold">
                        {expense.description}
                      </p>
                      <p className="text-sm">{category?.title}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-bold">₹ {expense.amount}</p>
                    <p className="text-sm">
                      {dayjs(expense.created_at).format("DD-MMM-YYYY")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {isModalOpen && (
            <Modal title="Add expense" onClose={handleResetModal}>
              <div className="flex flex-col p-4 bg-white rounded-b-xl">
                <div className="flex flex-col">
                  <label className="font-bold">Enter a description</label>
                  <input
                    placeholder="Books"
                    className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="font-bold">Enter Amount</label>
                  <input
                    placeholder="2000"
                    className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                    type="number"
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="font-bold">Type of expense</label>
                  <select
                    className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                    value={expenseCategoryId}
                    onChange={(e) => setExpenseCategoryId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {expenseCategory.map((category) => {
                      return (
                        <option
                          value={category.expense_category_id}
                          key={category.expense_category_id}
                        >
                          {category.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="flex flex-col mt-2">
                  <label className="font-bold">Enter Date (optional)</label>
                  <input
                    className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                    type="date"
                    onChange={(e) => setCreatedAt(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <Button
                    text="Add"
                    onClick={() => handleAddClick()}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  />
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Expenses;
