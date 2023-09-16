import { axiosInstance } from "@/api/api";
import { getNameInitials } from "@/lib/utils";
import { UserType } from "@/types/user.type";
import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const fetchInitData = async () => {
    try {
      const { data, status } = await axiosInstance.get("/api/users");
      if (status === 200) {
        setUser(data);
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitData();
  }, []);

  return (
    <div className="flex w-full">
      {!isLoading && !isError ? (
        <div className="flex justify-between p-3 w-full h-fit sticky bg-black text-white">
          <div>
            <Link href={`/dashboard`}>
              <p className="text-base font-bold">Hello, {user?.first_name}!</p>
            </Link>
          </div>
          <div>
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600">
              <Link href="/profile">
                <p className="text-xs">
                  {getNameInitials(user?.first_name, user?.last_name)}
                </p>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
