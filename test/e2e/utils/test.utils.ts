import { faker } from '@faker-js/faker';

export const generateTestUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

export const generateTestTask = () => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
});
