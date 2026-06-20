<script lang="ts">
	import KpiCard from '$lib/components/shared/KpiCard.svelte';
	import ProgressBar from '$lib/components/shared/ProgressBar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="home-dashboard">
	<header>
		<h2>Engineering Operations Platform</h2>
		<p class="subtext">Cross-module overview as of Q2 2026</p>
	</header>

	<div class="kpi-row">
		<KpiCard label="Teams" value={data.kpis.totalTeams} subtitle="tracked" />
		<KpiCard label="Engineers" value={data.kpis.totalEmployees} subtitle="platform-wide" />
		<KpiCard label="Avg KYP Score" value={`${data.kpis.avgCompositeScore}`} subtitle="composite" />
		<KpiCard label="Active Onboardings" value={data.kpis.activeOnboardings} subtitle="in progress" />
		<KpiCard label="Training Completion" value={`${data.kpis.trainingCompletion}%`} subtitle="platform-wide" />
		<KpiCard label="Infra Assets" value={data.kpis.totalInfraAssets} subtitle="catalogued" />
	</div>

	<div class="module-cards">
		<a class="panel module-card" href="/kyp">
			<h3>KYP</h3>
			<p>Team performance scores, source metrics, and scoring configuration.</p>
			<span class="arrow">→</span>
		</a>
		<a class="panel module-card" href="/onboarding">
			<h3>Onboarding</h3>
			<p>{data.kpis.activeOnboardings} active · {data.onboarding.blockedTasks} blocked tasks</p>
			<span class="arrow">→</span>
		</a>
		<a class="panel module-card" href="/infrastructure">
			<h3>Infrastructure</h3>
			<p>{data.kpis.totalInfraAssets} assets catalogued across all teams.</p>
			<span class="arrow">→</span>
		</a>
		<a class="panel module-card" href="/training">
			<h3>Training</h3>
			<p>{data.training.overdueTrainings} overdue trainings across the org.</p>
			<span class="arrow">→</span>
		</a>
		<a class="panel module-card" href="/reports">
			<h3>Reports</h3>
			<p>Cross-module stakeholder dashboards and executive summaries.</p>
			<span class="arrow">→</span>
		</a>
	</div>

	<div class="two-col">
		<section class="panel">
			<h3>Upcoming Onboardings</h3>
			{#if data.onboarding.upcomingStartDates.length === 0}
				<p class="empty">No upcoming start dates.</p>
			{:else}
				<ul class="upcoming-list">
					{#each data.onboarding.upcomingStartDates as item}
						<li>
							<span class="name">{item.person.name}</span>
							<span class="meta">{item.team.name} · {item.startDate}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<section class="panel">
			<h3>Training Completion by Team</h3>
			<ul class="training-list">
				{#each data.training.completionByTeam as row}
					<li>
						<span class="team-name">{row.team.name}</span>
						<div class="bar-wrap">
							<ProgressBar value={row.rate} variant={row.rate >= 80 ? 'success' : row.rate >= 60 ? 'default' : 'warning'} />
						</div>
						<span class="pct">{row.rate}%</span>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</section>

<style>
	.home-dashboard { display: grid; gap: 1.5rem; max-width: 90rem; }
	header h2 { margin: 0; }
	.subtext { margin: 0.2rem 0 0; color: var(--muted); font-size: 0.9rem; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }
	.kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
	.module-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
	.module-card { display: flex; flex-direction: column; text-decoration: none; color: inherit; transition: box-shadow 0.15s; position: relative; }
	.module-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
	.module-card h3 { margin: 0 0 0.4rem; color: var(--accent); font-size: 1rem; }
	.module-card p { margin: 0; font-size: 0.84rem; color: var(--muted); flex: 1; }
	.arrow { display: block; margin-top: 1rem; color: var(--accent); font-weight: bold; align-self: flex-end; }
	.two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
	.upcoming-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
	.upcoming-list li { display: flex; justify-content: space-between; gap: 1rem; font-size: 0.88rem; padding: 0.4rem 0; border-bottom: 1px solid var(--border); }
	.upcoming-list li:last-child { border-bottom: none; }
	.name { font-weight: 600; }
	.meta { color: var(--muted); font-size: 0.8rem; }
	.training-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.6rem; }
	.training-list li { display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; align-items: center; font-size: 0.88rem; }
	.team-name { font-weight: 600; white-space: nowrap; }
	.bar-wrap { min-width: 80px; }
	.pct { font-size: 0.78rem; color: var(--muted); text-align: right; white-space: nowrap; }
	.empty { color: var(--muted); font-size: 0.88rem; margin: 0; }
</style>
