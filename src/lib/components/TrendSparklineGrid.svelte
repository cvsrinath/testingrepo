<script lang="ts">
	import type { TrendPoint } from '$lib/types/kyp';

	interface Props {
		trends: Record<string, TrendPoint[]>;
	}

	let { trends }: Props = $props();
	const metricNames = $derived(Object.keys(trends));

	function pointsFor(values: TrendPoint[]): string {
		const max = Math.max(...values.map((value) => value.value), 1);
		const min = Math.min(...values.map((value) => value.value), 0);
		const spread = max - min || 1;
		return values
			.map((value, index) => {
				const x = (index / (values.length - 1 || 1)) * 220;
				const y = 64 - ((value.value - min) / spread) * 56;
				return `${x},${y}`;
			})
			.join(' ');
	}
</script>

<article class="panel trends" data-testid="trend-grid">
	<h3>13-Week Trends</h3>
	<div class="trend-grid">
		{#each metricNames as metric}
			<div class="spark">
				<p>{metric}</p>
				<svg viewBox="0 0 220 70" role="img" aria-label={`trend ${metric}`}>
					<polyline points={pointsFor(trends[metric])} />
				</svg>
			</div>
		{/each}
	</div>
</article>

<style>
	.trends h3 {
		margin-top: 0;
	}

	.trend-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.spark {
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.55rem;
		background: var(--surface-alt);
	}

	.spark p {
		margin: 0 0 0.25rem;
		font-size: 0.8rem;
		font-weight: 700;
	}

	svg {
		width: 100%;
		height: auto;
	}

	polyline {
		fill: none;
		stroke: var(--accent-strong);
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
</style>
