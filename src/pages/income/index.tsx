import { axiosInstance } from "@/api/api";
import LogoBadge from "@/components/badge/LogoBadge";
import Button from "@/components/button/Button";
import Layout from "@/components/layout/Layout";
import Modal from "@/components/modal/Modal";
import { IncomeType } from "@/types/income.type";
import {
  faArrowUp,
  faFileInvoiceDollar,
  faMoneyCheckDollar,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const incomeCategory = [
  {
    income_category_id: "1",
    title: "Salary",
    logo: faMoneyCheckDollar,
    color: "bg-green-300",
  },
  {
    income_category_id: "2",
    title: "Others",
    logo: faFileInvoiceDollar,
    color: "bg-cyan-300",
  },
];

const getCategory = (id: string) => {
  return incomeCategory.find((item) => item.income_category_id === id);
};

const Income = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [isError, setIsError] = useState<string | null>(null);
  const [incomeList, setIncomeList] = useState<IncomeType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("Income");
  const [amount, setAmount] = useState(0);
  const [incomeCategoryId, setIncomeCategoryId] = useState<string | undefined>(
    "1"
  );
  const [createdAt, setCreatedAt] = useState("");
  const [isCreateError, setIsCreateError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [incomeId, setIncomeId] = useState<string | undefined>("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString());

  const fetchData = async () => {
    try {
      const { data, status } = await axiosInstance.get("/api/finances");
      if (status === 200) {
        setMonthlyIncome(data?.monthly_income);
        setAmount(data?.monthly_income);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIncomeListData = async () => {
    try {
      const selectedMonthArray = selectedMonth.split("-");
      const { data, status } = await axiosInstance.get(
        `/api/incomes/?month=${selectedMonthArray[1]}&year=${selectedMonthArray[0]}`
      );
      if (status === 200) {
        setIncomeList(data);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(error?.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchIncomeListData();
  }, []);

  useEffect(() => {
    fetchIncomeListData();
  }, [selectedMonth]);

  const handleIncomeClick = (item: IncomeType) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setTitle(item.description);
    setAmount(item.amount);
    setIncomeCategoryId(item.income_category_id);
    setCreatedAt(item.income_date);
    setIncomeId(item.income_id);
  };

  const handleResetModal = () => {
    setTitle("Salary");
    setAmount(monthlyIncome);
    setCreatedAt("");
    setIsModalOpen(false);
    setIsCreateError(null);
    setIncomeCategoryId("1");
    setIncomeId(undefined);
    setIsEdit(false);
  };

  const postNewIncome = async (payload: IncomeType) => {
    setIsCreateError(null);
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.post("/api/incomes", {
        ...payload,
      });
      if (status === 200) {
        setIncomeList((incomeList) => [...incomeList, data]);
        handleResetModal();
      }
    } catch (error: any) {
      console.log(error);
      setIsCreateError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateIncome = async (payload: IncomeType) => {
    setIsCreateError(null);
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.put("/api/incomes", {
        ...payload,
      });
      if (status === 200) {
        const newList = incomeList.map((item) =>
          item.income_id === data?.income_id ? data : item
        );
        setIncomeList(newList);
        handleResetModal();
      }
    } catch (error: any) {
      console.log(error);
      setIsCreateError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteIncome = async (income_id: string) => {
    setIsCreateError(null);
    try {
      setIsDeleting(true);
      const { data, status } = await axiosInstance.delete("/api/incomes", {
        data: { income_id },
      });
      if (status === 200) {
        const newList = incomeList.filter(
          (item) => item.income_id !== data?.income_id
        );
        setIncomeList(newList);
        handleResetModal();
      }
    } catch (error: any) {
      console.log(error);
      setIsCreateError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveClick = () => {};

  const handleAddClick = () => {
    if (title && amount && incomeCategoryId) {
      const payload: IncomeType = {
        description: title,
        income_category_id: incomeCategoryId,
        amount,
        income_date: createdAt
          ? new Date(createdAt).toISOString()
          : new Date().toISOString(),
        income_id: isEdit ? incomeId : undefined,
      };
      if (isEdit) {
        updateIncome(payload);
      } else {
        postNewIncome(payload);
      }
    }
  };

  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <p>Loading...</p>
        </div>
      ) : !isError ? (
        <div className="flex flex-col w-full min-h-screen bg-white text-black">
          <div className="flex flex-col p-4">
            <div className="flex items-center">
              <p className="text-2xl font-bold mr-2">Your Income</p>
              <LogoBadge logo={faArrowUp} color="bg-green-400" />
            </div>
            <div className="flex flex-col mt-4">
              <label className="font-bold">
                Your monthly income is{" "}
                <span className="text-gray-400">Rs.</span>
              </label>
              <input
                placeholder="50000"
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="number"
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                value={monthlyIncome.toString()}
              />
            </div>
            <div className="mt-2">
              <Button
                text="Save"
                onClick={handleSaveClick}
                isLoading={isSaving}
                isDisabled={isSaving}
              />
            </div>
            <p className="text-lg font-bold mt-4">Add income to your savings</p>
            <div className="flex justify-between p-4 mt-2 rounded-xl shadow-md shadow-slate-400">
              <div>
                <p className="text-base font-bold">Add new income</p>
                <p className="text-sm">Track better by adding your incomes.</p>
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
            <div className="mt-2">
              <input
                className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                type="month"
                onChange={(e) => setSelectedMonth(e.target.value)}
                value={dayjs(selectedMonth).format("YYYY-MM")}
              />
            </div>
            {incomeList.length === 0 && (
              <p className="text-xl font-bold text-center mt-8">
                No incomes for the month!
              </p>
            )}
            {incomeList
              .sort(
                (a, b) =>
                  // @ts-ignore
                  new Date(b.investment_date) -
                  // @ts-ignore
                  new Date(a.investment_date)
              )
              .map((investment) => {
                const category = getCategory(investment.income_category_id);
                return (
                  <div
                    className="flex justify-between w-full py-2 mt-2 rounded-xl"
                    key={investment.income_id}
                    onClick={() => handleIncomeClick(investment)}
                  >
                    <div className="flex items-center w-3/5">
                      <LogoBadge
                        logo={category?.logo}
                        color={category?.color}
                      />
                      <div className="flex flex-col flex-1 ml-2">
                        <p className="text-base font-bold">
                          {investment.description}
                        </p>
                        <p className="text-sm">{category?.title}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-sm font-bold">₹ {investment.amount}</p>
                      <p className="text-sm">
                        {dayjs(investment.income_date).format("DD-MMM-YYYY")}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
          {isModalOpen && (
            <Modal title="Add income" onClose={handleResetModal}>
              <div className="flex flex-col p-4 bg-white rounded-b-xl">
                <div className="flex flex-col">
                  <label className="font-bold">Enter a description</label>
                  <input
                    placeholder="Nifty 50"
                    className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="font-bold">Enter Amount</label>
                  <input
                    placeholder="2000"
                    className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                    type="number"
                    onChange={(e) => setAmount(Number(e.target.value))}
                    value={amount.toString()}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label className="font-bold">Type of income</label>
                  <select
                    className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                    value={incomeCategoryId}
                    onChange={(e) => setIncomeCategoryId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {incomeCategory.map((category) => {
                      return (
                        <option
                          value={category.income_category_id}
                          key={category.income_category_id}
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
                    value={dayjs(createdAt).format("YYYY-MM-DD")}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    text={isEdit ? "Edit" : "Add"}
                    onClick={() => handleAddClick()}
                    isLoading={isSaving}
                    isDisabled={isSaving}
                  />
                  {isEdit && (
                    <Button
                      text="Delete"
                      onClick={() => deleteIncome(incomeId as string)}
                      isLoading={isDeleting}
                      isDisabled={isDeleting}
                      theme="DESTRUCTIVE"
                    />
                  )}
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
      ) : null}
    </Layout>
  );
};

export default Income;
