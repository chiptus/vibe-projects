<script lang="ts">
  let {
    trueDescription = $bindable(),
    falseDescription = $bindable(),
  }: { trueDescription: string; falseDescription: string } = $props();
</script>

<div class="space-y-2">
  <span class="font-medium">Criteria (optional)</span>
  <input
    class="w-full rounded border border-slate-300 px-2 py-1"
    placeholder="what counts as true"
    bind:value={trueDescription}
  />
  <input
    class="w-full rounded border border-slate-300 px-2 py-1"
    placeholder="what counts as false"
    bind:value={falseDescription}
  />
</div>
