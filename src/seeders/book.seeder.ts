import { AppDataSource } from '@config/database';
import { Book } from '@entities/Book.entity';
import { faker } from '@faker-js/faker';

const generateBookTitle = (): string => {
  const titleTypes = [
    () => `The ${faker.word.noun()} of ${faker.word.noun()}`,
    () => `The ${faker.word.adjective()} ${faker.word.noun()}`,
    () => `${faker.word.noun()}'s ${faker.word.noun()}`,
    () => `${faker.word.adjective()} ${faker.word.noun()}s`,
    () => faker.word.sample().charAt(0).toUpperCase() + faker.word.sample().slice(1)
  ];

  const randomTitleGenerator = faker.helpers.arrayElement(titleTypes);
  return randomTitleGenerator();
};

export const seedBooks = async () => {
  const bookRepository = AppDataSource.getRepository(Book);
  const existingBooks = new Set((await bookRepository.find()).map(book => book.name));
  let createdCount = 0;

  while (createdCount < 50) {
    const bookName = generateBookTitle();
    
    if (existingBooks.has(bookName)) {
      continue;
    }

    try {
      const book = bookRepository.create({
        name: bookName
      });
      await bookRepository.save(book);
      existingBooks.add(bookName);
      createdCount++;
      console.log(`Seeded book: ${bookName}`);
    } catch (error) {
      console.error(`Error seeding book: ${bookName}`, error);
    }
  }

  console.log(`Total books seeded: ${await bookRepository.count()}`);
};