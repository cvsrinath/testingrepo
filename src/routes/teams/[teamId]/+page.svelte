<script lang="ts">
	import AlertPanel from '$lib/components/AlertPanel.svelte';
	import MetricCard from '$lib/components/MetricCard.svelte';
	import PeriodSelector from '$lib/components/PeriodSelector.svelte';
	import { periodDescriptions } from '$lib/mock/kypData';
	import { selectedPeriod } from '$lib/stores/period';
	import { periodCompositeMultipliers, periodViewScalars } from '$lib/utils/supervisorMetrics';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let activeTab = $state<'metrics' | 'members' | 'deployments' | 'defects'>('metrics');
	let memberQuery = $state('');
	let memberRole = $state('');
	let memberStatus = $state('');

	function roundMetric(value: number, digits = 1): number {
		return Number(value.toFixed(digits));
	}

	function clampPercent(value: number): number {
		return Math.max(0, Math.min(100, value));
	}

	function scaleScore(value: number, scalar: number): number {
		return roundMetric(clampPercent(value * scalar));
	}

	const periodDescription = $derived(periodDescriptions[$selectedPeriod]);
	const periodScalar = $derived(periodViewScalars[$selectedPeriod]);
	const periodScore = $derived(roundMetric(data.detail.aggregatedScore * periodCompositeMultipliers[$selectedPeriod]));
	const periodBreakdown = $derived({
		codeQuality: scaleScore(data.detail.scoreBreakdown.codeQuality, periodScalar.quality),
		prActivity: scaleScore(data.detail.scoreBreakdown.prActivity, periodScalar.activity),
		deployments: scaleScore(
			data.detail.scoreBreakdown.deployments,
			(periodScalar.activity + periodScalar.reliability) / 2
		),
		defectsMttr: scaleScore(
			data.detail.scoreBreakdown.defectsMttr,
			(periodScalar.incidents + periodScalar.reliability) / 2
		),
		hotfixes: scaleScore(data.detail.scoreBreakdown.hotfixes, periodScalar.incidents),
		gcp: scaleScore(data.detail.scoreBreakdown.gcp, (periodScalar.activity + periodScalar.incidents) / 2)
	});

	const periodMetrics = $derived({
		prThroughput: roundMetric(data.detail.metrics.prThroughput30d * periodScalar.activity),
		prReviewTimeHours: roundMetric(data.detail.metrics.prReviewTimeHours * (2 - periodScalar.reliability)),
		mergeRate: roundMetric(clampPercent(data.detail.metrics.mergeRate * periodScalar.reliability)),
		deploymentFrequency: roundMetric(data.detail.metrics.deploymentFrequency30d * periodScalar.activity),
		prodBuildSuccessRate: roundMetric(
			clampPercent(data.detail.metrics.prodBuildSuccessRate * periodScalar.reliability)
		),
		mttrHours: roundMetric(data.detail.metrics.mttrHours30d * (2 - periodScalar.reliability)),
		productionDefects: Math.max(0, Math.round(data.detail.metrics.productionDefects30d * periodScalar.incidents)),
		hotfixCount: Math.max(0, Math.round(data.detail.metrics.hotfixCount30d * periodScalar.incidents)),
		gcpChanges: Math.max(0, Math.round(data.detail.metrics.gcpChanges30d * periodScalar.activity)),
		gcpIncidents: Math.max(0, Math.round(data.detail.metrics.gcpIncidents30d * periodScalar.incidents))
	});

	const filteredMembers = $derived(
		data.detail.members.filter((member) => {
			const matchesQuery =
				memberQuery.trim().length === 0 ||
				member.displayName.toLowerCase().includes(memberQuery.trim().toLowerCase());
			const matchesRole = memberRole.length === 0 || member.roleLevel === memberRole;
			const matchesStatus = memberStatus.length === 0 || member.status === memberStatus;
			return matchesQuery && matchesRole && matchesStatus;
		})
	);

	const roles = $derived(Array.from(new Set(data.detail.members.map((member) => member.roleLevel))));
	const memberActivityLabel = $derived(
		$selectedPeriod === 'YTD' ? 'Contribution Activity YTD' : `Contribution Activity ${$selectedPeriod}`
	);
</script>

<section class="team-detail">
	<header class="panel hero">
		<div>
			<p class="eyebrow">Team Detail</p>
			<h2>{data.detail.name}</h2>
			<p class="subtext">
				{data.detail.region} / {data.detail.memberCount} members / {data.detail.activeFlag ? 'Active' : 'Inactive'}
			</p>
			<p class="subtext-note" data-testid="team-period-description">{periodDescription}</p>
		</div>
		<div class="hero__controls">
			<PeriodSelector />
			<p class="period-badge">Viewing: <strong>{$selectedPeriod}</strong></p>
		</div>
		<div class="hero__score">
			<p>Aggregated score</p>
			<strong>{periodScore}</strong>
			<span>Updated {new Date(data.detail.lastActivityAt).toLocaleDateString()}</span>
		</div>
	</header>

	<div class="summary-grid">
		<MetricCard title="Code Quality" value={periodBreakdown.codeQuality.toFixed(1)} subtitle="Sonar-weighted" />
		<MetricCard title="PR Activity" value={periodBreakdown.prActivity.toFixed(1)} subtitle="Bitbucket + GitHub" />
		<MetricCard title="Deployments" value={periodBreakdown.deployments.toFixed(1)} subtitle="Jenkins production reliability" />
		<MetricCard title="Defects + MTTR" value={periodBreakdown.defectsMttr.toFixed(1)} subtitle="Incident resilience" />
		<MetricCard title="Hotfixes" value={periodBreakdown.hotfixes.toFixed(1)} subtitle="Inverse hotfix burden" />
		<MetricCard title="GCP" value={periodBreakdown.gcp.toFixed(1)} subtitle="Infra changes and incidents" />
	</div>

	<div class="tabs panel">
		<div class="tab-buttons">
			<button class:active={activeTab === 'metrics'} onclick={() => (activeTab = 'metrics')}>Metrics</button>
			<button class:active={activeTab === 'members'} onclick={() => (activeTab = 'members')}>Members</button>
			<button class:active={activeTab === 'deployments'} onclick={() => (activeTab = 'deployments')}>Deployments</button>
			<button class:active={activeTab === 'defects'} onclick={() => (activeTab = 'defects')}>Defects</button>
		</div>

		{#if activeTab === 'metrics'}
			<div class="metrics-grid" data-testid="team-metrics-tab">
				<p><strong>PR throughput ({$selectedPeriod})</strong><span>{periodMetrics.prThroughput}</span></p>
				<p><strong>PR review time</strong><span>{periodMetrics.prReviewTimeHours}h</span></p>
				<p><strong>Merge rate</strong><span>{periodMetrics.mergeRate}%</span></p>
				<p><strong>Deployment frequency ({$selectedPeriod})</strong><span>{periodMetrics.deploymentFrequency}</span></p>
				<p><strong>Prod build success</strong><span>{periodMetrics.prodBuildSuccessRate}%</span></p>
				<p><strong>MTTR</strong><span>{periodMetrics.mttrHours}h</span></p>
				<p><strong>Prod defects ({$selectedPeriod})</strong><span>{periodMetrics.productionDefects}</span></p>
				<p><strong>Hotfixes ({$selectedPeriod})</strong><span>{periodMetrics.hotfixCount}</span></p>
				<p><strong>GCP changes ({$selectedPeriod})</strong><span>{periodMetrics.gcpChanges}</span></p>
				<p><strong>GCP incidents ({$selectedPeriod})</strong><span>{periodMetrics.gcpIncidents}</span></p>
			</div>
		{:else if activeTab === 'members'}
			<div class="members-tab" data-testid="team-members-tab">
				<div class="member-filters">
					<label>
						Search members
						<input bind:value={memberQuery} placeholder="Search by name" />
					</label>
					<label>
						Role
						<select bind:value={memberRole}>
							<option value="">All</option>
							{#each roles as role}
								<option value={role}>{role}</option>
							{/each}
						</select>
					</label>
					<label>
						Status
						<select bind:value={memberStatus}>
							<option value="">All</option>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>
					</label>
				</div>

				<div class="member-list-head" data-testid="team-members-head">
					<span>Member</span>
					<span>{memberActivityLabel}</span>
					<span>Last Active</span>
				</div>

				<div class="member-list">
					{#if filteredMembers.length === 0}
						<p class="empty-state">No team members matched the current filters.</p>
					{:else}
						{#each filteredMembers as member}
							<a class="member-row" href={`/employees/${member.employeeId}`}>
								<div>
									<strong>{member.displayName}</strong>
									<span>{member.roleLevel} / {member.status}</span>
								</div>
								<div class="member-metric">
									<span>{memberActivityLabel}</span>
									<strong>{Math.round(member.contributions30d * periodScalar.activity)}</strong>
								</div>
								<div class="member-metric">
									<span>Last active</span>
									<strong>{new Date(member.lastActivityAt).toLocaleDateString()}</strong>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</div>
		{:else if activeTab === 'deployments'}
			<div class="stacked-copy" data-testid="team-deployments-tab">
				<p><strong>Last production deployment:</strong> {new Date(data.detail.lastDeploymentAt).toLocaleString()}</p>
				<p><strong>Deployment frequency ({$selectedPeriod}):</strong> {periodMetrics.deploymentFrequency}</p>
				<p><strong>Production success rate:</strong> {periodMetrics.prodBuildSuccessRate}%</p>
			</div>
		{:else}
			<div class="stacked-copy" data-testid="team-defects-tab">
				<p><strong>Production defects ({$selectedPeriod}):</strong> {periodMetrics.productionDefects}</p>
				<p><strong>MTTR ({$selectedPeriod}):</strong> {periodMetrics.mttrHours} hours</p>
				<p><strong>Hotfixes ({$selectedPeriod}):</strong> {periodMetrics.hotfixCount}</p>
			</div>
		{/if}
	</div>

	<AlertPanel alerts={data.detail.alerts} />
</section>

<style>
	.team-detail {
		display: grid;
		gap: 1rem;
	}

	.hero,
	.hero__score,
	.hero__controls,
	.tab-buttons,
	.metrics-grid p {
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

	h2,
	.subtext,
	.subtext-note,
	.hero__score p,
	.hero__score span,
	.metrics-grid p,
	.stacked-copy p {
		margin: 0;
	}

	.subtext,
	.subtext-note,
	.hero__score p,
	.hero__score span,
	.member-row span,
	.member-metric span {
		color: var(--muted);
	}

	.hero__controls,
	.hero__score {
		align-content: start;
	}

	.hero__score strong {
		font-size: 2rem;
		line-height: 1;
	}

	.period-badge {
		margin: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 2.25rem;
		align-self: start;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--ink);
		background: color-mix(in srgb, var(--accent) 8%, var(--surface));
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.45rem 0.85rem;
		white-space: nowrap;
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.tab-buttons {
		margin-bottom: 1rem;
	}

	.tab-buttons button {
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.55rem 0.85rem;
		background: var(--surface);
		cursor: pointer;
		font: inherit;
	}

	.tab-buttons button.active {
		background: var(--accent);
		color: #fff;
		border-color: var(--accent);
	}

	.metrics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
		gap: 0.75rem 1rem;
	}

	.metrics-grid p,
	.member-row,
	.stacked-copy p {
		padding: 0.75rem 0.85rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--surface-alt);
	}

	.member-filters {
		display: grid;
		grid-template-columns: minmax(14rem, 2fr) repeat(2, minmax(10rem, 1fr));
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	input,
	select {
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.6rem 0.85rem;
		font: inherit;
		background: var(--surface);
	}

	.member-list {
		display: grid;
		gap: 0.6rem;
	}

	.member-list-head {
		display: grid;
		grid-template-columns: minmax(12rem, 2fr) minmax(10rem, 1fr) minmax(9rem, 1fr);
		gap: 0.75rem;
		padding: 0 0.85rem 0.5rem;
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
	}

	.member-row {
		display: grid;
		grid-template-columns: minmax(12rem, 2fr) minmax(10rem, 1fr) minmax(9rem, 1fr);
		text-decoration: none;
		color: inherit;
		align-items: center;
	}

	.member-row strong {
		display: block;
	}

	.member-metric {
		display: grid;
		gap: 0.15rem;
		justify-items: start;
	}

	.empty-state {
		margin: 0;
		padding: 0.85rem;
		border: 1px dashed var(--border);
		border-radius: 4px;
		color: var(--muted);
		background: var(--surface-alt);
	}

	@media (max-width: 900px) {
		.member-filters {
			grid-template-columns: 1fr;
		}

		.member-list-head,
		.member-row {
			grid-template-columns: 1fr;
		}
	}
</style>
