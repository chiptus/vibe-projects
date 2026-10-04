<script lang="ts">
  import type { JevAnswer } from '../../../lib/jev';
  import ProbabilityBar from './ProbabilityBar.svelte';

  let { result }: { result: JevAnswer } = $props();

  function probabilityEntries(probabilities: Record<string, number>) {
    return Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  }
</script>

<div class="space-y-2 rounded border border-slate-300 p-2">
  {#if result.type === 'choice'}
    <p class="font-medium">
      Answer: {result.choice}
      <span class="text-slate-500">({Math.round(result.confidence * 100)}% confidence)</span>
    </p>
    {#each probabilityEntries(result.probabilities) as [option, probability]}
      <ProbabilityBar label={option} {probability} />
    {/each}
  {:else if result.type === 'score'}
    <p class="font-medium">
      Score: {result.score.toFixed(2)} — {result.legend[String(Math.round(result.score))]}
      <span class="text-slate-500">({Math.round(result.confidence * 100)}% confidence)</span>
    </p>
    {#each probabilityEntries(result.probabilities) as [level, probability]}
      <ProbabilityBar label={result.legend[level] ?? level} {probability} />
    {/each}
  {:else}
    <p class="font-medium">Yes probability: {Math.round(result.noul * 100)}%</p>
    <ProbabilityBar label="yes" probability={result.noul} />
  {/if}
</div>
