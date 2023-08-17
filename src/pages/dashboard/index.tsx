import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import DashboardHeroBanner from "@/modules/dashboardModules/heroBanner/DashboardHeroBanner";
import OverviewBanner from "@/modules/dashboardModules/overviewBanner/OverviewBanner";
import GoalBanner from "@/modules/dashboardModules/goalBanner/GoalBanner";
import { UserType } from "@/types/user.type";
import { axiosInstance, originUrl } from "@/api/api";
import { FinanceType } from "@/types/finance.type";
import { ExpenseType } from "@/types/expenses.type";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { userId } = query;
  let userData = {};
  let financeData = {};
  let expenses = [];
  try {
    const { status, data } = await axiosInstance.get(
      `/api/users/?userId=${userId}`
    );
    if (status === 200) {
      userData = data;
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const { data, status } = await axiosInstance.get(
      `/api/finances/?userId=${userId}`
    );
    if (status === 200) {
      financeData = data;
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const { data, status } = await axiosInstance.get(
      `/api/expenses/?userId=${userId}`
    );
    if (status === 200) {
      expenses = data;
    }
  } catch (error) {
    console.log(error);
  }
  return {
    props: { user: userData, finance: financeData, expenses },
  };
}

interface DashboardProps {
  user: UserType;
  finance: FinanceType;
  expenses: ExpenseType[];
}

const Dashboard = ({ user, finance, expenses }: DashboardProps) => {
  return (
    <Layout>
      {user?.user_id ? (
        <div className="flex flex-col w-full">
          <Navbar user_id={user.user_id} first_name={user.first_name} />
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
          <p>User not found! Please try again.</p>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
