<script lang="ts">
	import AlertPanel from '$lib/components/AlertPanel.svelte';
	import CohortDistributionPanel from '$lib/components/CohortDistributionPanel.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import PeriodSelector from '$lib/components/PeriodSelector.svelte';
	import TeamRosterTable from '$lib/components/TeamRosterTable.svelte';
	import {
		alerts,
		periodDescriptions,
		teamName,
		teamRoster,
		weightPresetDescriptions,
		weightPresets
	} from '$lib/mock/kypData';
	import { selectedPeriod } from '$lib/stores/period';
	import type { SortDirection, SortableMetric, WeightPreset } from '$lib/types/kyp';
	import { downloadCsv, teamRowsToCsv } from '$lib/utils/csv';
	import { nextSortDirection, sortTeamMembers } from '$lib/utils/sorting';
	import { applyPeriodMetrics, applyWeightPreset } from '$lib/utils/supervisorMetrics';

	let sortKey = $state<SortableMetric>('compositeScore');
	let sortDirection = $state<SortDirection>('desc');
	let selectedWeightPreset = $state<WeightPreset>(weightPresets[1]);

	const periodAdjustedRows = $derived(applyPeriodMetrics(teamRoster, $selectedPeriod));
	const rosterRows = $derived(applyWeightPreset(periodAdjustedRows, selectedWeightPreset));
	const sortedRows = $derived(sortTeamMembers(rosterRows, sortKey, sortDirection));
	const avgComposite = $derived(
		(sortedRows.reduce((sum, row) => sum + row.compositeScore, 0) / sortedRows.length).toFixed(1)
	);
	const periodDescription = $derived(periodDescriptions[$selectedPeriod]);
	const weightDescription = $derived(weightPresetDescriptions[selectedWeightPreset]);

	function onSort(column: SortableMetric): void {
		if (sortKey === column) {
			sortDirection = nextSortDirection(sortDirection);
			return;
		}

		sortKey = column;
		sortDirection = 'desc';
	}

	function exportCsv(): void {
		const csv = teamRowsToCsv(sortedRows);
		const period = $selectedPeriod.toLowerCase();
		downloadCsv(csv, `${teamName.replaceAll(' ', '_')}_${period}.csv`);
	}
</script>

<section class="supervisor">
	<div class="supervisor__header panel">
		<div>
			<p class="eyebrow">Supervisor Dashboard</p>
			<h2>{teamName}</h2>
			<p class="subtext">Team roster and cohort comparisons for {$selectedPeriod}</p>
			<p class="subtext-note" data-testid="period-description">{periodDescription}</p>
		</div>
		<div class="supervisor__header-controls">
			<PeriodSelector />
			<label>
				Metric weight preset
				<select bind:value={selectedWeightPreset}>
					{#each weightPresets as preset}
						<option value={preset}>{preset}</option>
					{/each}
				</select>
			</label>
			<button class="button button--primary" onclick={exportCsv}>Export CSV</button>
		</div>
	</div>
	<p class="preset-description panel" data-testid="preset-description">{weightDescription}</p>

	<div class="summary-grid">
		<MetricCard
			title="Team Members"
			value={sortedRows.length}
			subtitle="Roster size in current filter"
			testId="team-members-card"
		/>
		<MetricCard
			title="Avg Composite"
			value={avgComposite}
			subtitle="Cohort normalized score"
			testId="avg-composite-card"
		/>
		<MetricCard title="Selected Preset" value={selectedWeightPreset} subtitle="Calibration profile" />
	</div>

	<div class="supervisor__grid">
		<TeamRosterTable rows={sortedRows} {sortKey} {sortDirection} {onSort} />
		<CohortDistributionPanel rows={sortedRows} metric={sortKey} />
	</div>

	<AlertPanel {alerts} />
</section>

<style>
	.supervisor {
		display: grid;
		gap: 1rem;
	}

	.supervisor__header {
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

	.subtext {
		margin: 0;
		color: var(--muted);
	}

	.subtext-note {
		margin: 0.4rem 0 0;
		color: var(--ink);
		font-size: 0.85rem;
		max-width: 34rem;
	}

	.preset-description {
		margin: 0;
		font-size: 0.9rem;
	}

	.supervisor__header-controls {
		display: flex;
		gap: 0.75rem;
		align-items: end;
		flex-wrap: wrap;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-weight: 700;
		font-size: 0.85rem;
	}

	select {
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 0.45rem 0.6rem;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.supervisor__grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 20rem;
		gap: 1rem;
		align-items: start;
	}

	@media (max-width: 1024px) {
		.supervisor__grid {
			grid-template-columns: 1fr;
		}
	}
</style>
