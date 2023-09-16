import { axiosInstance } from "@/api/api";
import Button from "@/components/button/Button";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const handleSignupClick = async () => {
    if (email && password && firstName && lastName) {
      try {
        const payload = {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        };
        const { data, status } = await axiosInstance.post("/api/users", {
          ...payload,
        });
        if (status === 200) {
          router.push(`/onboarding`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      <div className="fixed left-0 right-0 top-0 bottom-0 w-full min-h-screen bg-black text-white">
        <div className="flex flex-col p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-4/5">
          <p className="text-3xl font-bold ">Sign up to</p>
          <p className="text-4xl font-bold ">Fin Savvy</p>
          <p className="text-sm  mt-2">
            Do you think you are financially stable? Let's see.
          </p>
          <div className="flex flex-col mt-8">
            <label className="font-bold">First Name</label>
            <input
              placeholder="Enter your first name"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500 bg-black"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">Last Name</label>
            <input
              placeholder="Enter your last name"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500 bg-black"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">Email</label>
            <input
              placeholder="Enter your email-id"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500 bg-black"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">Password</label>
            <input
              placeholder="Enter password"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500 bg-black"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-8">
            <Button text="Sign up" theme="LIGHT" onClick={handleSignupClick} />
          </div>
          <Link href="/login" className="mt-2 text-center">
            <p className="text-sm">Already have account? Login</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
