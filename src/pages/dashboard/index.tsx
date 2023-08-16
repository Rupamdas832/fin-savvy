import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import DashboardHeroBanner from "@/modules/dashboardModules/heroBanner/DashboardHeroBanner";
import OverviewBanner from "@/modules/dashboardModules/overviewBanner/OverviewBanner";
import GoalBanner from "@/modules/dashboardModules/goalBanner/GoalBanner";
import { UserType } from "@/types/user.type";
import { originUrl } from "@/api/api";
import { FinanceType } from "@/types/finance.type";
import { ExpenseType } from "@/types/expenses.type";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { userId } = query;
  let data = {};
  let financeData = {};
  let expenses = [];
  try {
    const res = await fetch(originUrl + `/api/users/?userId=${userId}`);
    data = await res.json();
  } catch (error) {
    console.log(error);
  }
  try {
    const res = await fetch(originUrl + `/api/finances/?userId=${userId}`);
    financeData = await res.json();
  } catch (error) {
    console.log(error);
  }
  try {
    const res = await fetch(originUrl + `/api/expenses/?userId=${userId}`);
    expenses = await res.json();
  } catch (error) {
    console.log(error);
  }
  return {
    props: { user: data, finance: financeData, expenses },
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
    </Layout>
  );
};

export default Dashboard;
