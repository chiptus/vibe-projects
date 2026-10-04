export type AnswerType = 'choice' | 'score' | 'noul';

export interface ChoiceOption {
  option: string;
  description: string;
}

export interface FormState {
  apiKey: string;
  instructions: string;
  answerType: AnswerType;
  choiceOptions: ChoiceOption[];
  scoreLevels: string[];
  noulTrue: string;
  noulFalse: string;
}

export interface PageContent {
  url: string;
  title: string;
  text: string;
}

export type JevQuestion =
  | { type: 'choice'; instructions: string; criteria: Record<string, string | null> }
  | { type: 'score'; instructions: string; criteria: string[] }
  | { type: 'noul'; instructions: string; criteria?: { true?: string; false?: string } };

export type JevAnswer =
  | { type: 'choice'; choice: string; probabilities: Record<string, number>; confidence: number }
  | { type: 'score'; score: number; legend: Record<string, string>; probabilities: Record<string, number>; confidence: number }
  | { type: 'noul'; noul: number };

const JEV_ENDPOINT = 'https://api.typesafe.ai/v1/systemone';

export const CHOICE_MIN = 2;
export const CHOICE_MAX = 255;
export const SCORE_MIN = 2;
export const SCORE_MAX = 10;

export function buildQuestion(form: FormState): JevQuestion {
  switch (form.answerType) {
    case 'choice': {
      const criteria: Record<string, string | null> = {};
      for (const { option, description } of form.choiceOptions) {
        if (option.trim()) criteria[option.trim()] = description.trim() || null;
      }
      return { type: 'choice', instructions: form.instructions, criteria };
    }
    case 'score': {
      const criteria = form.scoreLevels.map((level) => level.trim()).filter(Boolean);
      return { type: 'score', instructions: form.instructions, criteria };
    }
    case 'noul': {
      const criteria: { true?: string; false?: string } = {};
      if (form.noulTrue.trim()) criteria.true = form.noulTrue.trim();
      if (form.noulFalse.trim()) criteria.false = form.noulFalse.trim();
      return {
        type: 'noul',
        instructions: form.instructions,
        criteria: Object.keys(criteria).length ? criteria : undefined,
      };
    }
  }
}

export function validateForm(form: FormState): string | null {
  if (!form.apiKey.trim()) return 'API key is required.';
  if (!form.instructions.trim()) return 'Question is required.';

  if (form.answerType === 'choice') {
    const filled = form.choiceOptions.filter((o) => o.option.trim());
    if (filled.length < CHOICE_MIN) return `Choice needs at least ${CHOICE_MIN} options.`;
    if (filled.length > CHOICE_MAX) return `Choice supports at most ${CHOICE_MAX} options.`;
  }

  if (form.answerType === 'score') {
    const filled = form.scoreLevels.filter((l) => l.trim());
    if (filled.length < SCORE_MIN) return `Score needs at least ${SCORE_MIN} levels.`;
    if (filled.length > SCORE_MAX) return `Score supports at most ${SCORE_MAX} levels.`;
  }

  return null;
}

export async function askQuestion(apiKey: string, page: PageContent, question: JevQuestion): Promise<JevAnswer> {
  const body = {
    model: 'jev-latest',
    state: { page },
    questions: { answer: question },
  };

  const res = await fetch(JEV_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Jev request failed (${res.status}): ${detail || res.statusText}`);
  }

  const json = await res.json();
  return json.answers.answer as JevAnswer;
}

export async function askJev(form: FormState, page: PageContent): Promise<JevAnswer> {
  return askQuestion(form.apiKey, page, buildQuestion(form));
}
