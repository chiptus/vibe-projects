<script lang="ts">
  import { CHOICE_MIN, CHOICE_MAX, type ChoiceOption } from '../../../lib/jev';

  let { options = $bindable() }: { options: ChoiceOption[] } = $props();

  function addOption() {
    if (options.length >= CHOICE_MAX) return;
    options.push({ option: '', description: '' });
  }

  function removeOption(index: number) {
    if (options.length <= CHOICE_MIN) return;
    options.splice(index, 1);
  }
</script>

<div class="space-y-2">
  <span class="font-medium">Options</span>
  {#each options as choiceOption, index}
    <div class="flex gap-1">
      <input
        class="w-1/3 rounded border border-slate-300 px-2 py-1"
        placeholder="option"
        bind:value={choiceOption.option}
      />
      <input
        class="flex-1 rounded border border-slate-300 px-2 py-1"
        placeholder="description (optional)"
        bind:value={choiceOption.description}
      />
      <button
        type="button"
        class="rounded border border-slate-300 px-2 text-slate-500 disabled:opacity-30"
        disabled={options.length <= CHOICE_MIN}
        onclick={() => removeOption(index)}
      >
        ×
      </button>
    </div>
  {/each}
  <button
    type="button"
    class="text-blue-600 disabled:text-slate-300"
    disabled={options.length >= CHOICE_MAX}
    onclick={addOption}
  >
    + Add option
  </button>
</div>
