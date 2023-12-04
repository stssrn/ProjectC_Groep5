import prisma from "../lib/prisma";
import getRandomAccounts from "../lib/accounts";
import { hashPassword } from "../lib/passwordUtils";

async function seed() {
  const accounts = getRandomAccounts(30);
  const promises = accounts.map(async (account) => {
    const hashedPassword = await hashPassword("defaultPassword123");
    return prisma.users.upsert({
      where: { email: `${account.username.toLowerCase()}@example.com` },
      update: {},
      create: {
        email: `${account.username.toLowerCase()}${account.id}@example.com`,
        password: hashedPassword,
        address: "Voorbeeld Straat 123, 1234 AB, Voorbeeldstad",
        bio: "Dit is een Bio Voor " + account.firstName,
        firstName: account.firstName,
        lastName: account.lastName,
        username: account.username,
        registationDate: account.creationDate,
      },
    });
  });

  await Promise.all(promises);
  console.log("Database seeded!");
}

seed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });