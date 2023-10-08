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
import ChecklistBanner from "@/modules/dashboardModules/checklistBanner/ChecklistBanner";

const Dashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [finance, setFinance] = useState<FinanceType | null>(null);
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    const financeApi = () => axiosInstance.get("/api/finances");
    const expensesApi = () => axiosInstance.get("/api/expenses");

    try {
      const response: any = await Promise.all([financeApi(), expensesApi()]);
      if (response.length > 0) {
        setFinance(response[0].data);
        setExpenses(response[1].data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    try {
      const { data, status } = await axiosInstance.get("/api/users");
      if (status === 200) {
        setUser(data);
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

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Layout>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <p>Loading...</p>
        </div>
      ) : user ? (
        <div className="flex flex-col w-full">
          <DashboardHeroBanner
            user={user}
            finance={finance}
            expenses={expenses}
          />
          <div className="bg-white rounded-t-2xl">
            <ChecklistBanner finance={finance} />
          </div>
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
