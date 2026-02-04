import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '../app/generated/prisma/client';

const connectionString = process.env.DATABASE_URL || 'file:./database.db';
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

(async () => {
  // Product 생성
  for (let i = 0; i < 100; i++) {
    await prisma.product.create({
      data: {
        price: +faker.commerce.price({ min: 10000, max: 1000000 }),
        description: faker.commerce.productDescription(),
        title: faker.commerce.productName(),
        photo: faker.image.urlPicsumPhotos(),
        created_at: new Date(),
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
  }

  // Post 생성
  for (let i = 0; i < 50; i++) {
    await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        views: faker.number.int({ min: 0, max: 1000 }),
        created_at: faker.date.recent({ days: 30 }),
        user: {
          connect: {
            id: 1,
          },
        },
      },
    });
  }

  console.log('Seeding completed!');
})();
