import Layout from "@/components/layout/Layout";
import Button from "@/components/button/Button";
import { originUrl } from "@/api/api";
import { useRouter } from "next/router";
import { FinanceType } from "@/types/finance.type";

export async function getServerSideProps(context: any) {
  const { query } = context;
  const { id } = query;
  let data = {};
  try {
    const res = await fetch(originUrl + `/api/users/${id}/finances`);
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
  const { id } = query;

  const handleSavingsClick = () => {
    push(`/savings/${id}`);
  };

  const handleExpensesClick = () => {
    push(`/expenses/${id}/fixed`);
  };

  if (
    finance?.savings?.total_savings &&
    finance?.fixed_expenses?.total_fixed_expenses
  ) {
    push(`/dashboard/${id}`);
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
          {!finance?.savings?.total_savings && (
            <Button text="Savings" onClick={handleSavingsClick} theme="LIGHT" />
          )}
          <div className="mt-4">
            {!finance?.fixed_expenses?.total_fixed_expenses && (
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
