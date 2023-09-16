import { axiosInstance } from "@/api/api";
import Button from "@/components/button/Button";
import Layout from "@/components/layout/Layout";
import { useState } from "react";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginOutClick = async () => {
    setIsLoading(true);
    try {
      const { status } = await axiosInstance.get(`/api/logout`);
      if (status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center w-full min-h-screen bg-black text-white">
        <div className="flex flex-col p-4">
          <p className="text-4xl font-bold ">Your Profile</p>
          <div className="flex flex-col mt-8">
            <Button
              text={isLoading ? "Loging out" : "Log out"}
              theme="LIGHT"
              onClick={handleLoginOutClick}
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
