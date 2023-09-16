import Button from "@/components/button/Button";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLoginClick = async () => {
    const origin = window.location.origin;
    if (email && password) {
      setIsLoading(true);
      try {
        const payload = { email, password };
        const res = await fetch(origin + `/api/login`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.status === 200) {
          router.push(`/dashboard`);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Layout>
      <div className="fixed left-0 right-0 top-0 bottom-0 w-full min-h-screen bg-black text-white">
        <div className="flex flex-col p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5">
          <p className="text-4xl font-bold ">Log into your</p>
          <p className="text-4xl font-bold ">account</p>
          <p className="text-sm  mt-2">
            Do you think you are financially stable? Let's see.
          </p>
          <div className="flex flex-col mt-8">
            <label className="font-bold">Email</label>
            <input
              placeholder="Enter Email Id"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500 bg-black"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="font-bold">Password</label>
            <input
              placeholder="Enter Password"
              className="mt-2 border border-spacing-1 p-2 rounded-md border-slate-500 bg-black"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-8">
            <Button
              text={isLoading ? "Loging in" : "Log in"}
              theme="LIGHT"
              onClick={handleLoginClick}
              isLoading={isLoading}
              isDisabled={isLoading}
            />
          </div>
          <Link href="/signup" className="mt-2 text-center">
            <p className="text-sm">Need an account? Register</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
