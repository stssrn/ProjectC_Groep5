/*
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/passwordUtils';
import getRandomAccounts from '../lib/accounts';
import { getRandomDate } from '../lib/utils';

const prisma = new PrismaClient();

async function seed() {
  // Seed Users
  const accounts = getRandomAccounts(30);
  for (const account of accounts) {
    const hashedPassword = await hashPassword('defaultPassword123');
    await prisma.users.upsert({
      where: { email: `${account.username.toLowerCase()}${account.id}@example.com` },
      update: {},
      create: {
        email: `${account.username.toLowerCase()}@example.com`,
        password: hashedPassword,
        bio: "Dit is een Bio Voor " + account.firstName,
        firstName: account.firstName,
        lastName: account.lastName,
        username: account.username,
        registationDate: account.creationDate,
        firstLogin: true,
        isAdmin: false,
        isForumMod: false,

        // Other user fields as needed
      },
    });
  }

  // Seed other models with example data
  // Make sure to replace placeholders with actual logic to create related records
  for (let i = 1; i <= 10; i++) {
    await prisma.educatie_modules.upsert({
      where: { id: i},
      update: {},
      create: {
        title: `Module Title ${i}`,
        description: `Module description ${i}`,
      },
    });

    await prisma.casus.upsert({
      where: { id: i},
      update: {},
      create: {
        name: `Case Name ${i}`,
        description: `Case description ${i}`,
        url: `http://example.com/casus/${i}`,
      },
    });

    await prisma.post.upsert({
      where: { id: i},
      update: {},
      create: {
        title: `Post Title ${i}`,
        content: `Post content ${i}`,
        userId: i, // Assuming user IDs are in sequence and match the loop index
      },
    });

    const date = getRandomDate();
    await prisma.reaction.upsert({
      where: { id: i},
      update: {},
      create: {
        date: date,
        content: `Reaction content ${i}`,
        postId: i, // Assuming post IDs are in sequence and match the loop index
        userId: i, // Assuming user IDs are in sequence and match the loop index
      },
    });

    // await prisma.upvote.create({
    //   data: {
    //     userId: i, // Assuming user IDs are in sequence and match the loop index
    //     reactionId: i, // Assuming reaction IDs are in sequence and match the loop index
    //   },
    // });

    await prisma.event.upsert({
      where: { id: i},
      update: {},
      create: {
        date: date,
        name: `Event Name ${i}`,
        description: `Event description ${i}`,
      },
    });

    await prisma.bug.upsert({
      where: { id: i},
      update: {},
      create: {
        date: date,
        title: `Bug Title ${i}`,
        description: `Bug description ${i}`,
      },
    });

    await prisma.quiz.upsert({
      where: { id: i},
      update: {},
      create: {
        title: `Quiz Title ${i}`,
        questions: JSON.stringify([{ question: `Question ${i}`, answer: `Answer ${i}` }]),
        points: 100,
      },
    });

    await prisma.forum.upsert({
      where: { id: i},
      update: {},
      create: {
        userId: i,
        postId: i, // This should be a valid post ID
      },
    });

    await prisma.reactionPost.upsert({
      where: { id: i},
      update: {},
      create: {
        reactionId: i, // This should be a valid reaction ID
        postId: i, // This should be a valid post ID
      },
    });

    await prisma.agendaUser.upsert({
      where: { id: i},
      update: {},
      create: {
        eventId: i, // This should be a valid event ID
        userId: i, // This should be a valid user ID
      },
    });

    // await prisma.bugUser.upsert({
    //   where: { id: i},
    //   update: {},
    //   create: {
    //     bugId: i, // This should be a valid bug ID
    //     userId: i, // This should be a valid user ID
    //   },
    // });

    // await prisma.postUpvote.create({
    //   data: {
    //     postId: i, // This should be a valid post ID
    //     userId: i, // This should be a valid user ID
    //   },
    // });

    await prisma.quizUser.upsert({
      where: { id: i},
      update: {},
      create: {
        quizId: i, // This should be a valid quiz ID
        userId: i, // This should be a valid user ID
        isCompleted: true,
        pointsScored: 80,
      },
    });
  }

  console.log('Database seeded!');
}

seed()
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
  */
/*
import { PrismaClient, Event } from '@prisma/client';

// Instantiate the PrismaClient
const prisma = new PrismaClient();

// Function to generate a random date within the year 2024
const getRandomDateIn2024 = () => {
 const startDate = new Date('2024-01-01T00:00:00Z').getTime();
 const endDate = new Date('2024-12-31T23:59:59Z').getTime();
 const randomTime = startDate + Math.random() * (endDate - startDate);
 return new Date(randomTime);
};

// Define the data for the Event model (excluding 'id' field)
const eventData: Omit<Event, 'id'>[] = [
 {
   date: getRandomDateIn2024(),
   name: 'Project Kickoff',
   description: 'Kickoff meeting for the new project.',
 },
 {
   date: getRandomDateIn2024(),
   name: 'Company Anniversary Celebration',
   description: 'Celebrating our successful years!',
 },
];

// Define the seeding function
const seed = async () => {
 try {
   // Seed data for the Event model
   for (const data of eventData) {
     await prisma.event.create({
       data,
     });
   }

   console.log('Seeding completed successfully.');
 } catch (error) {
   console.error('Error seeding data:', error);
 } finally {
   // Disconnect the PrismaClient after seeding
   await prisma.$disconnect();
 }
};

// Execute the seeding function
seed();
*/
/*
// Import necessary modules
import { PrismaClient } from '@prisma/client';

// Instantiate PrismaClient
const prisma = new PrismaClient();

// Define the seed function
const seed = async () => {
  try {
    // Seed data
    const bugData = [
      { date: new Date(), title: 'Bug 1', description: 'Description for Bug 1' },
      { date: new Date(), title: 'Bug 2', description: 'Description for Bug 2' },
      { date: new Date(), title: 'Bug 3', description: 'Description for Bug 3' },
      // Add more entries as needed
    ];

    // Use PrismaClient to create bugs in the database
    await Promise.all(
      bugData.map(async (bug) => {
        await prisma.bug.create({ data: bug });
      })
    );

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect PrismaClient to avoid resource leaks
    await prisma.$disconnect();
  }
};

// Run the seed function
seed();
*/

/*
//educatie module seeder
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed data
  const moduleData = [
    { title: 'Angststoornis', description: 'Beschrijving van het herkennen van een angststoornis' },
    { title: 'Burn out', description: 'Beschrijving van burn out klachten' },
    { title: 'Psychose', description: 'Beschrijving van een psychose' },
    { title: 'Educatie module 4', description: 'Beschrijving van  een educatie module' },
    { title: 'Educatie module 5', description: 'Beschrijving van nog een educatie module' }
    // Add more modules as needed
  ];

  // Insert data into the database
  for (const data of moduleData) {
    await prisma.educatie_modules.create({
      data,
    });
  }

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/