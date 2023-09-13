import Button from "@/components/button/Button";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLoginClick = async () => {
    const origin = window.location.origin;
    if (email && password) {
      try {
        const payload = { email, password };
        const res = await fetch(origin + `/api/login`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.status === 200) {
          router.push(`/onboarding/?${data.userId}`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black text-white">
        <div className="flex flex-col p-4">
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
            <Button text="Log in" theme="LIGHT" onClick={handleLoginClick} />
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
