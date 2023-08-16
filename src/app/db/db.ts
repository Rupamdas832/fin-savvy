import { PrismaClient } from "@prisma/client";

// a new connection gets created
export const prisma = new PrismaClient({
  log: [{ emit: "event", level: "query" }],
});

// Print the SQL query to console for learning
prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

async function main() {
  // we will write prisma commands
  // Creating a new user to our database
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
