import { askQuestion, type PageContent } from './jev';
import { SITE_CATEGORIES } from './site-categories';

export async function categorizeSite(apiKey: string, page: PageContent): Promise<string> {
  const criteria: Record<string, string> = {};
  for (const category of SITE_CATEGORIES) criteria[category.label] = category.description;

  const answer = await askQuestion(apiKey, page, {
    type: 'choice',
    instructions: 'What category of website is this page part of?',
    criteria,
  });

  if (answer.type !== 'choice') throw new Error('Unexpected answer type from categorization.');
  return answer.choice;
}
