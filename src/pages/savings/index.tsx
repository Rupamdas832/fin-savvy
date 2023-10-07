import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import TipsCard from "@/components/tipsCard/TipsCard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import LogoBadge from "@/components/badge/LogoBadge";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { faBitcoinSign } from "@fortawesome/free-solid-svg-icons";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { SavingType } from "@/types/finance.type";
import { axiosInstance } from "@/api/api";
import { getNumberSystem } from "@/utils/general";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/tabs/Tabs";
import Modal from "@/components/modal/Modal";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InvestmentType } from "@/types/investments.type";

const tipsListEmergencyFund = [
  {
    id: 1,
    text: "Follow 50-30-20 rule. 50% of salary in needs, 30% in wants & 20% in savings",
  },
  {
    id: 2,
    text: "Use autodebit feature in bank account to save every month automatically.",
  },
];

const investmentCategory = [
  {
    investment_category_id: "1",
    title: "Stocks",
    logo: faChartSimple,
    color: "bg-blue-300",
  },
  {
    investment_category_id: "2",
    title: "Mutual Funds",
    logo: faArrowTrendUp,
    color: "bg-lime-300",
  },
  {
    investment_category_id: "3",
    title: "Fintech apps",
    logo: faCreditCard,
    color: "bg-pink-300",
  },
  {
    investment_category_id: "4",
    title: "Crypto",
    logo: faBitcoinSign,
    color: "bg-amber-300",
  },
];

const Savings = () => {
  const [bankBalance, setBankBalance] = useState(0);
  const [fdBalance, setFDBalance] = useState(0);
  const [liquidBalance, setLiquidBalance] = useState(0);
  const [equityBalance, setEquityBalance] = useState(0);
  const [goldBalance, setGoldBalance] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"SAVINGS" | "INVESTMENTS">(
    "SAVINGS"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [investmentCategoryId, setInvestmentCategoryId] = useState<
    string | undefined
  >("");
  const [isCreateError, setIsCreateError] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString());
  const [investmentList, setInvestmentList] = useState<InvestmentType[]>([]);
  const [investmentId, setInvestmentId] = useState<string | undefined>("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: any) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      isLeftSwipe ? setActiveTab("INVESTMENTS") : setActiveTab("SAVINGS");
    }
  };

  const fetchData = async () => {
    try {
      const { data, status } = await axiosInstance.get("/api/finances/savings");
      if (status === 200) {
        setBankBalance(data?.bank_balance);
        setFDBalance(data?.fd_balance);
        setEquityBalance(data?.equity_balance);
        setGoldBalance(data?.gold_balance);
        setTotalSavings(data?.total_savings);
        setLiquidBalance(data?.liquid_mf_balance);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvestmentListData = async () => {
    try {
      const selectedMonthArray = selectedMonth.split("-");
      const { data, status } = await axiosInstance.get(
        `/api/investments/?month=${selectedMonthArray[1]}&year=${selectedMonthArray[0]}`
      );
      if (status === 200) {
        setInvestmentList(data);
      }
    } catch (error: any) {
      console.log(error);
      setIsError(error?.message);
    }
  };

  const totalInvestments = useMemo(() => {
    return investmentList.reduce((accu, curr) => accu + curr.amount, 0);
  }, [investmentList]);

  useEffect(() => {
    fetchData();
    fetchInvestmentListData();
  }, []);

  const updateSavingsApi = async (payload: SavingType) => {
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.put(
        "/api/finances/savings",
        {
          ...payload,
        }
      );
      if (status === 200) {
        setTotalSavings(data.total_savings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCalculateClick = () => {
    const total_savings =
      bankBalance + fdBalance + equityBalance + goldBalance + liquidBalance;

    const newSavings: SavingType = {
      bank_balance: bankBalance,
      fd_balance: fdBalance,
      equity_balance: equityBalance,
      gold_balance: goldBalance,
      total_savings: total_savings,
      liquid_mf_balance: liquidBalance,
    };
    updateSavingsApi(newSavings);
  };

  const handleResetModal = () => {
    setTitle("");
    setAmount(0);
    setCreatedAt("");
    setIsModalOpen(false);
    setIsCreateError(null);
    setInvestmentCategoryId("");
    setInvestmentId(undefined);
    setIsEdit(false);
  };

  const postNewInvestment = async (payload: InvestmentType) => {
    setIsCreateError(null);
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.post("/api/investments", {
        ...payload,
      });
      if (status === 200) {
        setInvestmentList((investmentList) => [...investmentList, data]);
        handleResetModal();
      }
    } catch (error: any) {
      console.log(error);
      setIsCreateError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateInvestment = async (payload: InvestmentType) => {
    setIsCreateError(null);
    try {
      setIsSaving(true);
      const { data, status } = await axiosInstance.put("/api/investments", {
        ...payload,
      });
      if (status === 200) {
        const newList = investmentList.map((item) =>
          item.investment_id === data?.investment_id ? data : item
        );
        setInvestmentList(newList);
        handleResetModal();
      }
    } catch (error: any) {
      console.log(error);
      setIsCreateError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteInvestment = async (investment_id: string) => {
    setIsCreateError(null);
    try {
      setIsDeleting(true);
      const { data, status } = await axiosInstance.delete("/api/investments", {
        data: { investment_id },
      });
      if (status === 200) {
        const newList = investmentList.filter(
          (item) => item.investment_id !== data?.investment_id
        );
        setInvestmentList(newList);
        handleResetModal();
      }
    } catch (error: any) {
      console.log(error);
      setIsCreateError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddClick = () => {
    if (title && amount && investmentCategoryId) {
      const payload: InvestmentType = {
        description: title,
        investment_category_id: investmentCategoryId,
        amount,
        investment_date: createdAt
          ? new Date(createdAt).toISOString()
          : new Date().toISOString(),
        investment_id: isEdit ? investmentId : undefined,
      };
      if (isEdit) {
        updateInvestment(payload);
      } else {
        postNewInvestment(payload);
      }
    }
  };

  const handleInvestmentClick = (item: InvestmentType) => {
    setIsEdit(true);
    setIsModalOpen(true);
    setTitle(item.description);
    setAmount(item.amount);
    setInvestmentCategoryId(item.investment_category_id);
    setCreatedAt(item.investment_date);
    setInvestmentId(item.investment_id);
  };

  const getCategory = (id: string) => {
    return investmentCategory.find(
      (item) => item.investment_category_id === id
    );
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
              <p className="text-2xl font-bold mr-2">Total Savings</p>
              <LogoBadge logo={faSackDollar} color="bg-yellow-400" />
            </div>
            <p className="text-sm  mt-2">
              {activeTab === "SAVINGS" ? "Savings" : "Investments"}: ₹{" "}
              <span className="text-base font-bold">
                {getNumberSystem(
                  activeTab === "SAVINGS" ? totalSavings : totalInvestments
                )}
              </span>
            </p>
            <div
              className="mt-2 flex-1"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Tabs>
                <TabsList>
                  <TabsTrigger
                    value="SAVINGS"
                    onClick={() => setActiveTab("SAVINGS")}
                    activeTab={activeTab}
                  >
                    Savings
                  </TabsTrigger>
                  <TabsTrigger
                    value="INVESTMENTS"
                    onClick={() => setActiveTab("INVESTMENTS")}
                    activeTab={activeTab}
                  >
                    Investments
                  </TabsTrigger>
                </TabsList>
                {activeTab === "SAVINGS" && (
                  <TabsContent value="SAVINGS">
                    <div className="flex flex-col mt-4">
                      <label className="font-bold">
                        My total Bank balance is{" "}
                        <span className="text-gray-400">Rs.</span>
                      </label>
                      <input
                        placeholder="50000"
                        className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                        type="number"
                        onChange={(e) => setBankBalance(Number(e.target.value))}
                        value={bankBalance?.toString()}
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                      <label className="font-bold">
                        My total FD balance is{" "}
                        <span className="text-gray-400">Rs.</span>
                      </label>
                      <input
                        placeholder="200000"
                        className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                        type="number"
                        onChange={(e) => setFDBalance(Number(e.target.value))}
                        value={fdBalance?.toString()}
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                      <label className="font-bold">
                        Liquid mutual fund balance is{" "}
                        <span className="text-gray-400">Rs.</span>
                      </label>
                      <input
                        placeholder="200000"
                        className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                        type="number"
                        onChange={(e) =>
                          setLiquidBalance(Number(e.target.value))
                        }
                        value={liquidBalance?.toString()}
                      />
                    </div>
                    <div className="flex flex-col mt-4">
                      <label className="font-bold">
                        And total investments in Gold is{" "}
                        <span className="text-gray-400">Rs.</span>
                      </label>
                      <input
                        placeholder="200000"
                        className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                        type="number"
                        onChange={(e) => setGoldBalance(Number(e.target.value))}
                        value={goldBalance.toString()}
                      />
                    </div>
                    <div className="mt-4">
                      <Button
                        text="Save"
                        onClick={handleCalculateClick}
                        isLoading={isSaving}
                        isDisabled={isSaving}
                      />
                    </div>
                    <TipsCard list={tipsListEmergencyFund} />
                  </TabsContent>
                )}
                {activeTab === "INVESTMENTS" && (
                  <TabsContent value="INVESTMENTS">
                    <div className="flex justify-between p-4 mt-4 rounded-xl shadow-md shadow-slate-400">
                      <div>
                        <p className="text-base font-bold">
                          Add new investment
                        </p>
                        <p className="text-sm">
                          Track better by adding investments.
                        </p>
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
                    {investmentList
                      .sort(
                        (a, b) =>
                          // @ts-ignore
                          new Date(b.investment_date) -
                          // @ts-ignore
                          new Date(a.investment_date)
                      )
                      .map((investment) => {
                        const category = getCategory(
                          investment.investment_category_id
                        );
                        return (
                          <div
                            className="flex justify-between w-full py-2 mt-2 rounded-xl"
                            key={investment.investment_id}
                            onClick={() => handleInvestmentClick(investment)}
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
                              <p className="text-sm font-bold">
                                ₹ {investment.amount}
                              </p>
                              <p className="text-sm">
                                {dayjs(investment.investment_date).format(
                                  "DD-MMM-YYYY"
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </div>
          {isModalOpen && (
            <Modal title="Add investment" onClose={handleResetModal}>
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
                  <label className="font-bold">Type of investment</label>
                  <select
                    className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500"
                    value={investmentCategoryId}
                    onChange={(e) => setInvestmentCategoryId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {investmentCategory.map((category) => {
                      return (
                        <option
                          value={category.investment_category_id}
                          key={category.investment_category_id}
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
                      onClick={() => deleteInvestment(investmentId as string)}
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
      ) : (
        <div>{isError}</div>
      )}
    </Layout>
  );
};

export default Savings;
