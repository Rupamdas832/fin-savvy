import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import DashboardHeroBanner from "@/modules/dashboardModules/heroBanner/DashboardHeroBanner";
import OverviewBanner from "@/modules/dashboardModules/overviewBanner/OverviewBanner";
import GoalBanner from "@/modules/dashboardModules/goalBanner/GoalBanner";
import { UserType } from "@/types/user.type";
import { originUrl } from "@/api/api";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { id } = query;
  let data = {};
  try {
    const res = await fetch(originUrl + `/users/${id}`);
    data = await res.json();
  } catch (error) {
    console.log(error);
  }
  return {
    props: { user: data },
  };
}

interface DashboardProps {
  user: UserType;
}

const Dashboard = ({ user }: DashboardProps) => {
  return (
    <Layout>
      <div className="flex flex-col w-full">
        <Navbar user_id={user.user_id} first_name={user.first_name} />
        <DashboardHeroBanner user={user} />
        <OverviewBanner user_id={user.user_id} />
        <GoalBanner />
      </div>
    </Layout>
  );
};

export default Dashboard;
