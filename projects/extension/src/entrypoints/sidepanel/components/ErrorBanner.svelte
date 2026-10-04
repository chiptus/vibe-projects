<script lang="ts">
  let { message, onRetry }: { message: string; onRetry: () => void } = $props();
</script>

<div class="space-y-2 rounded border border-red-300 bg-red-50 p-2 text-red-700">
  <p>{message}</p>
  <button type="button" class="font-medium underline" onclick={onRetry}>Retry</button>
</div>
