<script lang="ts">
	import { metricLabels } from '$lib/mock/kypData';
	import type { EmployeeSummary, SortableMetric } from '$lib/types/kyp';

	interface Props {
		rows: EmployeeSummary[];
		metric: SortableMetric;
	}

	let { rows, metric }: Props = $props();

	const values = $derived(rows.map((row) => row[metric]).sort((a, b) => a - b));
	const min = $derived(values[0] ?? 0);
	const max = $derived(values[values.length - 1] ?? 1);
	const median = $derived(values[Math.floor(values.length / 2)] ?? 0);
	const q1 = $derived(values[Math.floor(values.length * 0.25)] ?? 0);
	const q3 = $derived(values[Math.floor(values.length * 0.75)] ?? 0);
	const average = $derived(values.reduce((acc, value) => acc + value, 0) / Math.max(values.length, 1));

	const bins = $derived.by(() => {
		if (values.length === 0) {
			return [];
		}

		const totalBins = 8;
		const span = Math.max(max - min, 1);
		const counts = Array.from({ length: totalBins }, () => 0);
		for (const value of values) {
			const index = Math.min(totalBins - 1, Math.floor(((value - min) / span) * totalBins));
			counts[index] += 1;
		}
		return counts;
	});

	const maxBin = $derived(Math.max(...bins, 1));
</script>

<aside class="panel dist" data-testid="cohort-panel">
	<h3>{metricLabels[metric]} Cohort Distribution</h3>
	<div class="histogram">
		{#each bins as count}
			<div class="bar-wrap">
				<div class="bar" style={`height: ${(count / maxBin) * 100}%`}></div>
			</div>
		{/each}
	</div>
	<div class="stats">
		<p><strong>Q1:</strong> {q1.toFixed(1)}</p>
		<p><strong>Median:</strong> {median.toFixed(1)}</p>
		<p><strong>Q3:</strong> {q3.toFixed(1)}</p>
		<p><strong>Avg:</strong> {average.toFixed(1)}</p>
	</div>
</aside>

<style>
	.dist h3 {
		margin-top: 0;
	}

	.histogram {
		height: 8rem;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		align-items: end;
		gap: 0.35rem;
		margin-bottom: 0.75rem;
	}

	.bar-wrap {
		height: 100%;
		background: var(--surface-alt);
		border-radius: 6px;
		display: flex;
		align-items: end;
	}

	.bar {
		width: 100%;
		background: linear-gradient(180deg, var(--accent), var(--accent-strong));
		border-radius: 6px;
	}

	.stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.25rem 1rem;
		font-size: 0.85rem;
	}

	.stats p {
		margin: 0;
	}
</style>
