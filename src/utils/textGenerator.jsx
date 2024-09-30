import { faker } from '@faker-js/faker';

export function generateParagraph(difficulty) {
  let sentenceCount;

  switch (difficulty) {
    case 'easy':
      sentenceCount = 3;
      break;
    case 'medium':
      sentenceCount = 5;
      break;
    case 'hard':
      sentenceCount = 7;
      break;
    default:
      sentenceCount = 5;
  }

  return faker.lorem.paragraph(sentenceCount);
}