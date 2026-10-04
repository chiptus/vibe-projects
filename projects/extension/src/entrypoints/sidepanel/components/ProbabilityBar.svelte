<script lang="ts">
  let { label, probability }: { label: string; probability: number } = $props();
</script>

<div class="flex items-center gap-2">
  <span class="w-24 truncate">{label}</span>
  <div class="h-2 flex-1 rounded bg-slate-100">
    <div class="h-2 rounded bg-blue-500" style={`width: ${probability * 100}%`}></div>
  </div>
  <span class="w-10 text-right">{Math.round(probability * 100)}%</span>
</div>
