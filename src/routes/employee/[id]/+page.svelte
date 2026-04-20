<script lang="ts">
	import ContributionSources from '$lib/components/ContributionSources.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import PeriodSelector from '$lib/components/PeriodSelector.svelte';
	import RadarDimensionsChart from '$lib/components/RadarDimensionsChart.svelte';
	import TrendSparklineGrid from '$lib/components/TrendSparklineGrid.svelte';
	import { selectedPeriod } from '$lib/stores/period';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let sharingEnabled = $state(false);
</script>

<section class="employee-page">
	<header class="panel employee-header">
		<div>
			<p class="eyebrow">Employee View</p>
			<h2>{data.employee.displayName}</h2>
			<p>{data.employee.roleLevel} • {data.employee.teamName}</p>
		</div>
		<div class="employee-header__controls">
			<PeriodSelector />
			<p class="coverage">{data.employee.periodCoverage}</p>
		</div>
	</header>

	<div class="cards">
		<MetricCard title="Composite Score" value={data.employee.compositeScore.toFixed(1)} subtitle={`Period ${$selectedPeriod}`} />
		<MetricCard title="Active Weeks" value={data.employee.activeWeeks} subtitle="Leave-adjusted denominator" />
		<MetricCard title="Last Updated" value={new Date(data.employee.lastUpdated).toLocaleDateString()} subtitle="Metric freshness" />
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
		<div class="controls">
			<label class="toggle">
				<input type="checkbox" bind:checked={sharingEnabled} />
				Share this view with manager
			</label>
			<a href="/employee/alex-rivera#alias-management" onclick={(event) => event.preventDefault()}
				>Alias management</a
			>
		</div>
	</section>

	<ContributionSources sources={data.employee.contributions} />
</section>

<style>
	.employee-page {
		display: grid;
		gap: 1rem;
	}

	.employee-header {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
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

	.suggestions h3 {
		margin-top: 0;
	}

	.suggestions ul {
		margin: 0;
		padding-left: 1rem;
		display: grid;
		gap: 0.45rem;
	}

	.controls {
		margin-top: 0.8rem;
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.toggle {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	@media (max-width: 1024px) {
		.visual-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
