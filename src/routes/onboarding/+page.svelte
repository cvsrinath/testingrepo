<script lang="ts">
	import KpiCard from '$lib/components/shared/KpiCard.svelte';
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="onboarding-dash">
	<header>
		<p class="eyebrow">Module</p>
		<h2>Employee Onboarding</h2>
	</header>

	<div class="kpi-row">
		<KpiCard label="New Hires This Month" value={data.stats.newHiresThisMonth} />
		<KpiCard label="Active Onboardings" value={data.stats.activeOnboardings} />
		<KpiCard label="Completed This Month" value={data.stats.completedThisMonth} />
		<KpiCard label="Blocked Tasks" value={data.stats.blockedTasks} />
		<KpiCard label="Avg Completion" value={`${data.stats.averageCompletionPercent}%`} />
	</div>

	<div class="dash-grid">
		<section class="panel">
			<h3>Upcoming Start Dates</h3>
			{#if data.stats.upcomingStartDates.length === 0}
				<p class="empty">No upcoming start dates in the next 30 days.</p>
			{:else}
				<table class="inner-table">
					<thead>
						<tr><th>Name</th><th>Team</th><th>Start Date</th></tr>
					</thead>
					<tbody>
						{#each data.stats.upcomingStartDates as entry}
							<tr>
								<td><a href="/onboarding/employees/{entry.person.id}">{entry.person.name}</a></td>
								<td>{entry.team.name}</td>
								<td>{entry.startDate}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</section>

		<section class="panel">
			<h3>Delayed / Blocked Tasks</h3>
			{#if data.stats.delayedTasks.length === 0}
				<p class="empty">No delayed or blocked tasks.</p>
			{:else}
				<ul class="task-list">
					{#each data.stats.delayedTasks as entry}
						<li>
							<a href="/onboarding/employees/{entry.employee.id}">{entry.employee.name}</a>
							<span>–</span>
							<span>{entry.task.title}</span>
							<StatusBadge status={entry.task.status} />
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</section>

<style>
	.onboarding-dash { display: grid; gap: 1.5rem; max-width: 72rem; }

	.eyebrow {
		margin: 0;
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		font-weight: 700;
	}

	h2 { margin: 0.25rem 0 0; font-size: 1.75rem; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }

	.kpi-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.75rem;
	}

	.dash-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.inner-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.inner-table th, .inner-table td { padding: 0.5rem 0; border-bottom: 1px solid var(--border); text-align: left; }
	.inner-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); }

	.task-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
	.task-list li { display: flex; gap: 0.4rem; align-items: center; font-size: 0.88rem; flex-wrap: wrap; }

	.empty { margin: 0; color: var(--muted); font-size: 0.88rem; }

	@media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }
</style>
