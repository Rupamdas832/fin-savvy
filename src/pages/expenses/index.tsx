import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faReceipt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
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

const Expenses = () => {
  const [title, setTitle] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState("");
  const [amount, setAmount] = useState(0);
  const [createdAt, setCreatedAt] = useState("");
  const [expenseList, setExpenseList] = useState<ExpenseType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isCreateError, setIsCreateError] = useState(null);

  const fetchInitData = async () => {
    try {
      setIsLoading(true);
      const { data, status } = await axiosInstance.get("/api/expenses");
      if (status === 200) {
        setExpenseList(data);
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

  const postNewExpense = async (payload: ExpenseType) => {
    setIsCreateError(null);
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.post("/api/expenses", {
        ...payload,
      });
      if (status === 200) {
        setExpenseList((expenseList) => [...expenseList, data]);
        handleResetModal();
      }
    } catch (error: any) {
      console.log(error);
      setIsCreateError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddClick = () => {
    if (title && expenseCategoryId && amount) {
      const newExpense: ExpenseType = {
        description: title,
        expense_category_id: expenseCategoryId,
        amount,
        expense_date: createdAt,
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
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-screen">
            <p>Loading...</p>
          </div>
        ) : !isError ? (
          <div className="flex flex-col p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <p className="text-2xl font-bold mr-2">Expenses</p>
                <LogoBadge logo={faArrowDown} color="bg-red-400" />
              </div>
              <Button
                text="Fixed expenses"
                onClick={() => router.push("/expenses/fixed")}
              />
            </div>
            <p className="text-sm  mt-2">
              Total: ₹{" "}
              <span className="text-base font-bold">{totalExpense}</span>
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
                      <LogoBadge
                        logo={category?.logo}
                        color={category?.color}
                      />
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
                        {dayjs(expense.expense_date).format("DD-MMM-YYYY")}
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
                      isLoading={isSaving}
                      isDisabled={isSaving}
                    />
                  </div>
                  {isCreateError && (
                    <p className="mt-2 p-2 bg-red-400 rounded-md">
                      {isCreateError}
                    </p>
                  )}
                </div>
              </Modal>
            )}
          </div>
        ) : (
          <div>{isError}</div>
        )}
      </div>
    </Layout>
  );
};

export default Expenses;
