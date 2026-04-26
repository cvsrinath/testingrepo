<script lang="ts">
	import ContributionSources from '$lib/components/ContributionSources.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import PeriodSelector from '$lib/components/PeriodSelector.svelte';
	import RadarDimensionsChart from '$lib/components/RadarDimensionsChart.svelte';
	import TrendSparklineGrid from '$lib/components/TrendSparklineGrid.svelte';
	import { selectedPeriod } from '$lib/stores/period';
	import { periodCompositeMultipliers } from '$lib/utils/supervisorMetrics';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const adjustedComposite = $derived(
		(data.employee.compositeScore * periodCompositeMultipliers[$selectedPeriod]).toFixed(1)
	);
</script>

<section class="employee-page">
	<div class="breadcrumb">
		<a href="/teams">Teams</a>
		<span>›</span>
		{#if data.employee.teamId}
			<a href={`/teams/${data.employee.teamId}`}>{data.employee.teamName}</a>
			<span>›</span>
		{/if}
		<span>{data.employee.displayName}</span>
	</div>

	<header class="panel employee-header">
		<div>
			<p class="eyebrow">Employee View</p>
			<h2>{data.employee.displayName}</h2>
			<p>{data.employee.roleLevel} / {data.employee.teamName}</p>
		</div>
		<div class="employee-header__controls">
			<PeriodSelector />
			<p class="period-badge">Viewing: <strong>{$selectedPeriod}</strong> period</p>
			<p class="coverage">{data.employee.periodCoverage}</p>
		</div>
	</header>

	<div class="cards">
		<MetricCard title="Composite Score" value={adjustedComposite} subtitle={`Adjusted for ${$selectedPeriod}`} />
		<MetricCard title="Active Weeks" value={data.employee.activeWeeks} subtitle="Leave-adjusted denominator" />
		<MetricCard
			title="Last Updated"
			value={new Date(data.employee.lastUpdated).toLocaleDateString()}
			subtitle="Metric freshness"
		/>
	</div>

	<div class="visual-grid">
		<RadarDimensionsChart dimensions={data.employee.dimensions} />
		<TrendSparklineGrid trends={data.employee.trends} />
	</div>

	<section class="panel suggestions">
		<h3>Improvement Suggestions</h3>
		<ul>
			{#each data.employee.improvementSuggestions as suggestion}
				<li>{suggestion}</li>
			{/each}
		</ul>
	</section>

	<ContributionSources sources={data.employee.contributions} />
</section>

<style>
	.employee-page {
		display: grid;
		gap: 1rem;
	}

	.breadcrumb {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.82rem;
		color: var(--muted);
	}

	.breadcrumb a {
		color: var(--accent);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.employee-header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		font-weight: 700;
	}

	h2 {
		margin: 0.2rem 0;
	}

	.employee-header p {
		margin: 0;
		color: var(--muted);
	}

	.employee-header__controls {
		display: grid;
		gap: 0.5rem;
		align-content: start;
	}

	.coverage {
		font-weight: 700;
		color: var(--ink);
	}

	.period-badge {
		margin: 0;
		font-size: 0.82rem;
		color: var(--muted);
		background: var(--surface-alt);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.35rem 0.7rem;
	}

	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.visual-grid {
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 1rem;
	}

	.suggestions h3,
	.suggestions ul {
		margin: 0;
	}

	.suggestions ul {
		padding-left: 1rem;
		display: grid;
		gap: 0.55rem;
	}

	@media (max-width: 1024px) {
		.visual-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
