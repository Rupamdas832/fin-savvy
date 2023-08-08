import Layout from "@/components/layout/Layout";
import Navbar from "@/components/navbar/Navbar";
import DashboardHeroBanner from "@/modules/dashboardModules/heroBanner/DashboardHeroBanner";
import OverviewBanner from "@/modules/dashboardModules/overviewBanner/OverviewBanner";
import GoalBanner from "@/modules/dashboardModules/goalBanner/GoalBanner";

const Dashboard = () => {
  return (
    <Layout>
      <div className="flex flex-col w-full">
        <Navbar />
        <DashboardHeroBanner />
        <OverviewBanner />
        <GoalBanner />
      </div>
    </Layout>
  );
};

export default Dashboard;
