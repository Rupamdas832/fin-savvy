-- CreateTable
CREATE TABLE "Finance" (
    "user_finance_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "house_rent" INTEGER NOT NULL DEFAULT 0,
    "electricity_bill" INTEGER NOT NULL DEFAULT 0,
    "utility_bill" INTEGER NOT NULL DEFAULT 0,
    "food_bill" INTEGER NOT NULL DEFAULT 0,
    "commute_bill" INTEGER NOT NULL DEFAULT 0,
    "ott_bill" INTEGER NOT NULL DEFAULT 0,
    "parent_donation" INTEGER NOT NULL DEFAULT 0,
    "other_bill" INTEGER NOT NULL DEFAULT 0,
    "total_fixed_expenses" INTEGER NOT NULL DEFAULT 0,
    "bank_balance" INTEGER NOT NULL DEFAULT 0,
    "fd_balance" INTEGER NOT NULL DEFAULT 0,
    "equity_balance" INTEGER NOT NULL DEFAULT 0,
    "gold_balance" INTEGER NOT NULL DEFAULT 0,
    "total_savings" INTEGER NOT NULL DEFAULT 0,
    "life_insurance_cover" INTEGER NOT NULL DEFAULT 0,
    "critical_illness_cover" INTEGER NOT NULL DEFAULT 0,
    "accidental_death_cover" INTEGER NOT NULL DEFAULT 0,
    "health_insurance_cover" INTEGER NOT NULL DEFAULT 0,
    "required__life_insurance_cover" INTEGER NOT NULL DEFAULT 0,
    "required_critical_illness_cover" INTEGER NOT NULL DEFAULT 0,
    "required_accidental_death_cover" INTEGER NOT NULL DEFAULT 0,
    "required_health_insurance_cover" INTEGER NOT NULL DEFAULT 0,
    "total_emi" INTEGER NOT NULL DEFAULT 0,
    "total_loan_amount" INTEGER NOT NULL DEFAULT 0,
    "emi_load" INTEGER NOT NULL DEFAULT 0,
    "emergency_fund" INTEGER NOT NULL DEFAULT 0,
    "monthly_income" INTEGER NOT NULL DEFAULT 0,
    "job_stability" INTEGER NOT NULL DEFAULT 0,
    "monthly_epf" INTEGER NOT NULL DEFAULT 0,
    "life_insurance_premium" INTEGER NOT NULL DEFAULT 0,
    "elss_investment" INTEGER NOT NULL DEFAULT 0,
    "health_insurance_premium" INTEGER NOT NULL DEFAULT 0,
    "parents_health_insurance_premium" INTEGER NOT NULL DEFAULT 0,
    "is_user_age_above_sixty" BOOLEAN NOT NULL DEFAULT false,
    "is_parents_age_above_sixty" BOOLEAN NOT NULL DEFAULT false,
    "nps_investment" INTEGER NOT NULL DEFAULT 0,
    "required_80C_investment" INTEGER NOT NULL DEFAULT 150000,
    "required_80D_investment" INTEGER NOT NULL DEFAULT 0,
    "required_80CCD_investment" INTEGER NOT NULL DEFAULT 50000,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("user_finance_id")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "expense_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "expense_category_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "expense_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("expense_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Finance_user_id_key" ON "Finance"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Expenses_user_id_key" ON "Expenses"("user_id");

-- AddForeignKey
ALTER TABLE "Finance" ADD CONSTRAINT "Finance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
