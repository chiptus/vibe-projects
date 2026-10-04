import type { FormState } from './jev';

const STORAGE_KEY = 'jev-page-judge:last-form';

export async function loadForm(): Promise<Partial<FormState> | null> {
  const stored = await browser.storage.local.get(STORAGE_KEY);
  return (stored[STORAGE_KEY] as Partial<FormState> | undefined) ?? null;
}

export async function saveForm(form: FormState): Promise<void> {
  await browser.storage.local.set({ [STORAGE_KEY]: form });
}
