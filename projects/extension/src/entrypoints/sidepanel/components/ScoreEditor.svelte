<script lang="ts">
  import { SCORE_MIN, SCORE_MAX } from '../../../lib/jev';

  let { levels = $bindable() }: { levels: string[] } = $props();

  function addLevel() {
    if (levels.length >= SCORE_MAX) return;
    levels.push('');
  }

  function removeLevel(index: number) {
    if (levels.length <= SCORE_MIN) return;
    levels.splice(index, 1);
  }
</script>

<div class="space-y-2">
  <span class="font-medium">Levels (ordered, low → high)</span>
  {#each levels as _level, index}
    <div class="flex gap-1">
      <input
        class="flex-1 rounded border border-slate-300 px-2 py-1"
        placeholder={`level ${index}`}
        bind:value={levels[index]}
      />
      <button
        type="button"
        class="rounded border border-slate-300 px-2 text-slate-500 disabled:opacity-30"
        disabled={levels.length <= SCORE_MIN}
        onclick={() => removeLevel(index)}
      >
        ×
      </button>
    </div>
  {/each}
  <button
    type="button"
    class="text-blue-600 disabled:text-slate-300"
    disabled={levels.length >= SCORE_MAX}
    onclick={addLevel}
  >
    + Add level
  </button>
</div>
