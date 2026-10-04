<script lang="ts">
  import type { Preset } from '../../../lib/presets';

  let {
    presetGroups,
    selectedPresetId,
    onSelect,
  }: {
    presetGroups: Record<string, Preset[]>;
    selectedPresetId: string;
    onSelect: (presetId: string) => void;
  } = $props();
</script>

<label class="block space-y-1">
  <span class="font-medium">Preset question</span>
  <select
    class="w-full rounded border border-slate-300 px-2 py-1"
    value={selectedPresetId}
    onchange={(e) => onSelect((e.target as HTMLSelectElement).value)}
  >
    <option value="">— Custom —</option>
    {#each Object.entries(presetGroups) as [category, presets]}
      <optgroup label={category}>
        {#each presets as preset}
          <option value={preset.id}>{preset.label}</option>
        {/each}
      </optgroup>
    {/each}
  </select>
</label>
