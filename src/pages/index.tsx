import Button from "@/components/button/Button";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/router";

const EmergencyFund = () => {
  const router = useRouter();
  const handleLoginClick = () => {
    router.push("/dashboard/1");
  };

  return (
    <Layout>
      <div className="flex flex-col w-full min-h-screen bg-white text-black">
        <div className="flex flex-col p-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold ">Login Page</p>
          </div>
          <p className="text-sm  mt-2">
            Do you think you are financially stable? Let's see.
          </p>
          <Button text="Login" onClick={handleLoginClick} />
        </div>
      </div>
    </Layout>
  );
};

export default EmergencyFund;
