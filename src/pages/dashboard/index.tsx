import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import DashboardHeroBanner from "@/modules/dashboardModules/heroBanner/DashboardHeroBanner";
import OverviewBanner from "@/modules/dashboardModules/overviewBanner/OverviewBanner";
import GoalBanner from "@/modules/dashboardModules/goalBanner/GoalBanner";
import { UserType } from "@/types/user.type";
import { axiosInstance, originUrl } from "@/api/api";
import { FinanceType } from "@/types/finance.type";
import { ExpenseType } from "@/types/expenses.type";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [finance, setFinance] = useState<FinanceType | null>(null);
  const [expenses, setExpenses] = useState<ExpenseType[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    const userApi = () => axiosInstance.get("/api/users");
    const financeApi = () => axiosInstance.get("/api/finances");
    const expensesApi = () => axiosInstance.get("/api/expenses");

    try {
      setIsLoading(true);
      const response: any = await Promise.all([
        userApi(),
        financeApi(),
        expensesApi(),
      ]);
      if (response.length > 0) {
        setUser(response[0].data);
        setFinance(response[1].data);
        setExpenses(response[2].data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <p>Loading...</p>
        </div>
      ) : user && finance && expenses ? (
        <div className="flex flex-col w-full">
          <DashboardHeroBanner
            user={user}
            finance={finance}
            expenses={expenses}
          />
          <OverviewBanner user_id={user.user_id} finance={finance} />
          <GoalBanner />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-screen">
          <p>User not found...</p>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
