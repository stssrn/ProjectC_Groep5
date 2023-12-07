import prisma from "../lib/prisma";
import getRandomAccounts from "../lib/accounts";

async function seed() {
  const promises = getRandomAccounts(30).map((account) => {
    return prisma.users.upsert({
      where: {
        id: account.id,
      },
      update: {},
      create: {
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        username: account.username,
        registationDate: account.creationDate,
      }});
  });
  const response = await Promise.all(promises);
  console.log(response);
}

seed()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
