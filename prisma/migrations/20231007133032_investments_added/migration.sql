-- CreateTable
CREATE TABLE "Investments" (
    "investment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "investment_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investments_pkey" PRIMARY KEY ("investment_id")
);

-- AddForeignKey
ALTER TABLE "Investments" ADD CONSTRAINT "Investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
