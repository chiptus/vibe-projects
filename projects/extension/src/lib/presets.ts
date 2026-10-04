import type { FormState } from './jev';

export type PresetForm = Pick<
  FormState,
  'instructions' | 'answerType' | 'choiceOptions' | 'scoreLevels' | 'noulTrue' | 'noulFalse'
>;

export interface Preset {
  id: string;
  label: string;
  category: string;
  form: PresetForm;
}

function choice(instructions: string, options: [string, string][]): PresetForm {
  return {
    instructions,
    answerType: 'choice',
    choiceOptions: options.map(([option, description]) => ({ option, description })),
    scoreLevels: ['', ''],
    noulTrue: '',
    noulFalse: '',
  };
}

function score(instructions: string, levels: string[]): PresetForm {
  return {
    instructions,
    answerType: 'score',
    choiceOptions: [
      { option: '', description: '' },
      { option: '', description: '' },
    ],
    scoreLevels: levels,
    noulTrue: '',
    noulFalse: '',
  };
}

function noul(instructions: string, trueDesc = '', falseDesc = ''): PresetForm {
  return {
    instructions,
    answerType: 'noul',
    choiceOptions: [
      { option: '', description: '' },
      { option: '', description: '' },
    ],
    scoreLevels: ['', ''],
    noulTrue: trueDesc,
    noulFalse: falseDesc,
  };
}

export function groupPresetsByCategory(presets: Preset[]): Record<string, Preset[]> {
  return presets.reduce<Record<string, Preset[]>>((groups, preset) => {
    (groups[preset.category] ??= []).push(preset);
    return groups;
  }, {});
}

export const PRESETS: Preset[] = [
  {
    id: 'hotel-quality-score',
    label: 'Rate hotel quality from comments',
    category: 'Booking.com',
    form: score('Rate the quality of the hotel based on its comments.', [
      'Poor',
      'Below average',
      'Average',
      'Good',
      'Excellent',
    ]),
  },
  {
    id: 'hotel-top-complaint',
    label: 'Top complaint in the reviews',
    category: 'Booking.com',
    form: choice('Which aspect do guests complain about most in the reviews?', [
      ['cleanliness', 'Dirty rooms, bathrooms, or common areas'],
      ['noise', 'Noise from other guests, street, or nearby venues'],
      ['staff', 'Unhelpful or rude staff'],
      ['location', 'Inconvenient or unsafe location'],
      ['price', 'Poor value for money'],
    ]),
  },
  {
    id: 'hotel-cleanliness-flag',
    label: 'Do reviews flag cleanliness issues?',
    category: 'Booking.com',
    form: noul(
      'Do the reviews mention issues with cleanliness?',
      'Reviews explicitly describe dirtiness, bad smells, or unclean rooms',
      'Reviews do not mention cleanliness problems',
    ),
  },
  {
    id: 'news-emotional-charge',
    label: 'Rate emotional charge of the language',
    category: 'News sites',
    form: score('Rate how emotionally charged this article\'s language is.', [
      'Neutral, factual tone',
      'Somewhat charged',
      'Highly charged or sensational',
    ]),
  },
  {
    id: 'news-topic',
    label: 'Primary topic of the article',
    category: 'News sites',
    form: choice('What is the primary topic of this article?', [
      ['politics', 'Government, elections, policy'],
      ['business', 'Companies, markets, economy'],
      ['technology', 'Tech products, software, science'],
      ['sports', 'Sports events and results'],
      ['other', 'Anything not covered above'],
    ]),
  },
  {
    id: 'news-balanced',
    label: 'Is the reporting balanced?',
    category: 'News sites',
    form: noul(
      'Does this article present multiple viewpoints in a balanced way?',
      'The article quotes or represents more than one side of the issue',
      'The article presents only one perspective',
    ),
  },
  {
    id: 'page-category',
    label: 'Categorize this page',
    category: 'Any page',
    form: choice('How should this page be categorized?', [
      ['e-commerce', 'Selling products or services'],
      ['blog', 'Personal or editorial writing'],
      ['documentation', 'Technical or product documentation'],
      ['forum', 'Discussion board or Q&A community'],
      ['other', 'Anything not covered above'],
    ]),
  },
  {
    id: 'page-trustworthiness',
    label: 'Rate how trustworthy this page looks',
    category: 'Any page',
    form: score('Rate how trustworthy this page appears, based on its content and writing.', [
      'Not trustworthy',
      'Somewhat trustworthy',
      'Trustworthy',
      'Very trustworthy',
    ]),
  },
];
