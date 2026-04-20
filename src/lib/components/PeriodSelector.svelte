<script lang="ts">
	import { periodOptions } from '$lib/mock/kypData';
	import { selectedPeriod, setPeriod } from '$lib/stores/period';
	import type { PeriodOption } from '$lib/types/kyp';
</script>

<label class="period-selector" for="period-select">
	Review period
	<select
		id="period-select"
		bind:value={$selectedPeriod}
		onchange={(event) => setPeriod((event.currentTarget as HTMLSelectElement).value as PeriodOption)}
	>
		{#each periodOptions as option}
			<option value={option}>{option}</option>
		{/each}
	</select>
</label>

<style>
	.period-selector {
		display: inline-flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.85rem;
		font-weight: 700;
	}

	select {
		background: var(--surface);
		border: 1px solid var(--border);
		color: var(--ink);
		border-radius: 10px;
		padding: 0.45rem 0.6rem;
	}
</style>
