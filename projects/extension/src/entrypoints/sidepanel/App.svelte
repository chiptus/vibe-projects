<script lang="ts">
  import { onMount } from 'svelte';
  import { askJev, validateForm, type FormState, type JevAnswer } from '../../lib/jev';
  import { extractActiveTabContent } from '../../lib/extract';
  import { loadForm, saveForm } from '../../lib/storage';
  import { PRESETS, groupPresetsByCategory } from '../../lib/presets';
  import PresetSelector from './components/PresetSelector.svelte';
  import SiteCategorizer from './components/SiteCategorizer.svelte';
  import ChoiceEditor from './components/ChoiceEditor.svelte';
  import ScoreEditor from './components/ScoreEditor.svelte';
  import NoulEditor from './components/NoulEditor.svelte';
  import ErrorBanner from './components/ErrorBanner.svelte';
  import ResultPanel from './components/ResultPanel.svelte';

  function defaultForm(): FormState {
    return {
      apiKey: '',
      instructions: '',
      answerType: 'choice',
      choiceOptions: [
        { option: '', description: '' },
        { option: '', description: '' },
      ],
      scoreLevels: ['', ''],
      noulTrue: '',
      noulFalse: '',
    };
  }

  let form = $state<FormState>(defaultForm());
  let status = $state<'idle' | 'loading' | 'error' | 'result'>('idle');
  let errorMessage = $state('');
  let result = $state<JevAnswer | null>(null);
  let selectedPresetId = $state('');
  let detectedCategory = $state<string | null>(null);

  const presetGroups = groupPresetsByCategory(PRESETS);
  const filteredPresetGroups = $derived(
    detectedCategory
      ? Object.fromEntries(
          Object.entries(presetGroups).filter(
            ([category]) => category === detectedCategory || category === 'Any page',
          ),
        )
      : presetGroups,
  );

  onMount(async () => {
    const stored = await loadForm();
    if (stored) form = { ...defaultForm(), ...stored };
  });

  function applyPreset(presetId: string) {
    selectedPresetId = presetId;
    if (!presetId) return;
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    form = { ...form, ...structuredClone(preset.form) };
    status = 'idle';
    result = null;
  }

  async function submit() {
    const validationError = validateForm(form);
    if (validationError) {
      status = 'error';
      errorMessage = validationError;
      return;
    }

    status = 'loading';
    errorMessage = '';
    result = null;

    try {
      await saveForm(form);
      const page = await extractActiveTabContent();
      result = await askJev(form, page);
      status = 'result';
    } catch (error) {
      status = 'error';
      errorMessage = error instanceof Error ? error.message : String(error);
    }
  }
</script>

<main class="min-h-screen w-full p-4 space-y-4 text-sm text-slate-900">
  <h1 class="text-lg font-semibold">Jev Page Judge</h1>

  <label class="block space-y-1">
    <span class="font-medium">TypeSafe API key</span>
    <input
      type="password"
      class="w-full rounded border border-slate-300 px-2 py-1"
      bind:value={form.apiKey}
      placeholder="ts-..."
    />
  </label>

  <SiteCategorizer apiKey={form.apiKey} bind:detectedCategory />

  <PresetSelector presetGroups={filteredPresetGroups} {selectedPresetId} onSelect={applyPreset} />

  <label class="block space-y-1">
    <span class="font-medium">Question</span>
    <textarea
      class="w-full rounded border border-slate-300 px-2 py-1"
      rows="3"
      bind:value={form.instructions}
      placeholder="Rate the quality of the hotel based on its comments"
    ></textarea>
  </label>

  <label class="block space-y-1">
    <span class="font-medium">Answer type</span>
    <select class="w-full rounded border border-slate-300 px-2 py-1" bind:value={form.answerType}>
      <option value="choice">Choice — pick one option</option>
      <option value="score">Score — position on a rubric</option>
      <option value="noul">Noul — yes/no probability</option>
    </select>
  </label>

  {#if form.answerType === 'choice'}
    <ChoiceEditor bind:options={form.choiceOptions} />
  {:else if form.answerType === 'score'}
    <ScoreEditor bind:levels={form.scoreLevels} />
  {:else}
    <NoulEditor bind:trueDescription={form.noulTrue} bind:falseDescription={form.noulFalse} />
  {/if}

  <button
    type="button"
    class="w-full rounded bg-blue-600 py-2 font-medium text-white disabled:opacity-50"
    disabled={status === 'loading'}
    onclick={submit}
  >
    {status === 'loading' ? 'Asking Jev…' : 'Submit'}
  </button>

  {#if status === 'error'}
    <ErrorBanner message={errorMessage} onRetry={submit} />
  {/if}

  {#if status === 'result' && result}
    <ResultPanel {result} />
  {/if}
</main>
