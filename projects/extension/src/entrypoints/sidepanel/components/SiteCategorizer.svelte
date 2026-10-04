<script lang="ts">
  import { categorizeSite } from '../../../lib/categorize';
  import { extractActiveTabContent } from '../../../lib/extract';

  let {
    apiKey,
    detectedCategory = $bindable(),
  }: { apiKey: string; detectedCategory: string | null } = $props();

  let status = $state<'idle' | 'loading' | 'error'>('idle');
  let errorMessage = $state('');

  async function categorize() {
    if (!apiKey.trim()) {
      status = 'error';
      errorMessage = 'Enter your API key first.';
      return;
    }

    status = 'loading';
    errorMessage = '';

    try {
      const page = await extractActiveTabContent();
      detectedCategory = await categorizeSite(apiKey, page);
      status = 'idle';
    } catch (error) {
      status = 'error';
      errorMessage = error instanceof Error ? error.message : String(error);
    }
  }
</script>

<div class="space-y-1">
  <div class="flex items-center gap-2">
    <button
      type="button"
      class="rounded border border-slate-300 px-2 py-1 font-medium disabled:opacity-50"
      disabled={status === 'loading'}
      onclick={categorize}
    >
      {status === 'loading' ? 'Categorizing…' : 'Categorize this site'}
    </button>
    {#if detectedCategory}
      <span class="text-slate-600">Detected: <strong>{detectedCategory}</strong></span>
      <button type="button" class="text-blue-600 underline" onclick={() => (detectedCategory = null)}>
        show all
      </button>
    {/if}
  </div>
  {#if status === 'error'}
    <p class="text-red-700">{errorMessage}</p>
  {/if}
</div>
