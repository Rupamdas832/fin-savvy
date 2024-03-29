import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import { originUrl } from "@/api/api";
import { useRouter } from "next/router";
import { FinanceType } from "@/types/finance.type";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { userId } = query;
  let data = {};
  try {
    const res = await fetch(originUrl + `/api/finances/?userId=${userId}`);
    data = await res.json();
  } catch (error) {
    console.log(error);
  }
  return {
    props: { finance: data },
  };
}

interface OnboardingProps {
  finance: FinanceType;
}
const Onboarding = ({ finance }: OnboardingProps) => {
  const { query, push } = useRouter();
  const { userId } = query;

  const handleSavingsClick = () => {
    push(`/savings/?userId=${userId}`);
  };

  const handleExpensesClick = () => {
    push(`/expenses/fixed/?userId=${userId}`);
  };

  if (finance?.total_savings && finance?.total_fixed_expenses) {
    push(`/dashboard/?userId=${userId}`);
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black text-white">
        <div className="flex items-center">
          <p className="text-4xl font-bold mr-2">Onboarding</p>
        </div>
        <p className="text-sm  mt-2">
          Do you think you are financialy stable? Let's find out.
        </p>
        <div className="mt-8 flex flex-col">
          {!finance?.total_savings && (
            <Button text="Savings" onClick={handleSavingsClick} theme="LIGHT" />
          )}
          <div className="mt-4">
            {!finance?.total_fixed_expenses && (
              <Button
                text="Fixed expenses"
                onClick={handleExpensesClick}
                theme="LIGHT"
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;
