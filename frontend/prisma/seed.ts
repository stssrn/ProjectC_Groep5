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
    await prisma.users.create({
      data: {
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
    await prisma.educatie_modules.create({
      data: {
        title: `Module Title ${i}`,
        description: `Module description ${i}`,
      },
    });

    await prisma.casus.create({
      data: {
        name: `Case Name ${i}`,
        description: `Case description ${i}`,
        url: `http://example.com/casus/${i}`,
      },
    });

    await prisma.post.create({
      data: {
        title: `Post Title ${i}`,
        content: `Post content ${i}`,
        userId: i, // Assuming user IDs are in sequence and match the loop index
      },
    });

    const date = getRandomDate();
    await prisma.reaction.create({
      data: {
        date: date,
        content: `Reaction content ${i}`,
        postId: i, // Assuming post IDs are in sequence and match the loop index
        userId: i, // Assuming user IDs are in sequence and match the loop index
      },
    });

    await prisma.upvote.create({
      data: {
        userId: i, // Assuming user IDs are in sequence and match the loop index
        reactionId: i, // Assuming reaction IDs are in sequence and match the loop index
      },
    });

    await prisma.event.create({
      data: {
        date: date,
        name: `Event Name ${i}`,
        description: `Event description ${i}`,
      },
    });

    await prisma.bug.create({
      data: {
        date: date,
        title: `Bug Title ${i}`,
        description: `Bug description ${i}`,
      },
    });

    await prisma.quiz.create({
      data: {
        title: `Quiz Title ${i}`,
        questions: JSON.stringify([{ question: `Question ${i}`, answer: `Answer ${i}` }]),
        points: 100,
      },
    });

    await prisma.forum.create({
      data: {
        userId: i,
        postId: i, // This should be a valid post ID
      },
    });

    await prisma.reactionPost.create({
      data: {
        reactionId: i, // This should be a valid reaction ID
        postId: i, // This should be a valid post ID
      },
    });

    await prisma.agendaUser.create({
      data: {
        eventId: i, // This should be a valid event ID
        userId: i, // This should be a valid user ID
      },
    });

    await prisma.bugUser.create({
      data: {
        bugId: i, // This should be a valid bug ID
        userId: i, // This should be a valid user ID
      },
    });

    await prisma.postUpvote.create({
      data: {
        postId: i, // This should be a valid post ID
        userId: i, // This should be a valid user ID
      },
    });

    await prisma.quizUser.create({
      data: {
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