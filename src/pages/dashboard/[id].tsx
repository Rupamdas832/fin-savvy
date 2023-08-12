import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import DashboardHeroBanner from "@/modules/dashboardModules/heroBanner/DashboardHeroBanner";
import OverviewBanner from "@/modules/dashboardModules/overviewBanner/OverviewBanner";
import GoalBanner from "@/modules/dashboardModules/goalBanner/GoalBanner";
import { UserType } from "@/types/user.type";
import { originUrl } from "@/api/api";
import { FinanceType } from "@/types/finance.type";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { id } = query;
  let data = {};
  let financeData = {};
  try {
    const res = await fetch(originUrl + `/users/${id}`);
    data = await res.json();
  } catch (error) {
    console.log(error);
  }
  try {
    const res = await fetch(originUrl + `/users/${id}/finances`);
    financeData = await res.json();
  } catch (error) {
    console.log(error);
  }
  return {
    props: { user: data, finance: financeData },
  };
}

interface DashboardProps {
  user: UserType;
  finance: FinanceType;
}

const Dashboard = ({ user, finance }: DashboardProps) => {
  return (
    <Layout>
      <div className="flex flex-col w-full">
        <Navbar user_id={user.user_id} first_name={user.first_name} />
        <DashboardHeroBanner user={user} finance={finance} />
        <OverviewBanner user_id={user.user_id} finance={finance} />
        <GoalBanner />
      </div>
    </Layout>
  );
};

export default Dashboard;
