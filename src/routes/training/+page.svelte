<script lang="ts">
	import KpiCard from '$lib/components/shared/KpiCard.svelte';
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="training-dash">
	<header>
		<p class="eyebrow">Module</p>
		<h2>Training Management</h2>
	</header>

	<div class="kpi-row">
		<KpiCard label="Total Courses" value={data.stats.totalCourses} />
		<KpiCard label="Completion Rate" value={`${data.stats.overallCompletionRate}%`} />
		<KpiCard label="Overdue Trainings" value={data.stats.overdueTrainings} />
		<KpiCard label="Expiring Certs" value={data.stats.expiringCertifications.length} />
	</div>

	<div class="dash-grid">
		<section class="panel">
			<h3>Upcoming Deadlines</h3>
			{#if data.stats.upcomingDeadlines.length === 0}
				<p class="empty">No upcoming deadlines.</p>
			{:else}
				<table class="inner-table">
					<thead><tr><th>Employee</th><th>Course</th><th>Due</th></tr></thead>
					<tbody>
						{#each data.stats.upcomingDeadlines as entry}
							<tr>
								<td><a href="/training/employees/{entry.person.id}">{entry.person.name}</a></td>
								<td>{entry.course.title}</td>
								<td>{entry.dueDate}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</section>

		<section class="panel">
			<h3>Completion by Category</h3>
			<ul class="bar-list">
				{#each data.stats.completionByCategory as row}
					<li>
						<span class="cat-label">{row.category}</span>
						<div class="bar-track"><div class="bar-fill" style="width: {row.rate}%"></div></div>
						<span class="cat-pct">{row.rate}%</span>
					</li>
				{/each}
			</ul>
		</section>

		<section class="panel">
			<h3>Completion by Team</h3>
			<table class="inner-table">
				<thead><tr><th>Team</th><th>Rate</th><th>Overdue</th></tr></thead>
				<tbody>
					{#each data.stats.completionByTeam as row}
						<tr>
							<td>{row.team.name}</td>
							<td>{row.rate}%</td>
							<td>{row.overdueCount}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>

		<section class="panel">
			<h3>Expiring Certifications</h3>
			{#if data.stats.expiringCertifications.length === 0}
				<p class="empty">No expiring certifications.</p>
			{:else}
				<ul class="cert-list">
					{#each data.stats.expiringCertifications as entry}
						<li>
							<a href="/training/employees/{entry.person.id}">{entry.person.name}</a>
							<span>–</span>
							<span>{entry.certification.name}</span>
							<StatusBadge status={entry.certification.status} />
						</li>
					{/each}
				</ul>
			{/if}
		</section>
	</div>
</section>

<style>
	.training-dash { display: grid; gap: 1.5rem; max-width: 80rem; }
	.eyebrow { margin: 0; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 700; }
	h2 { margin: 0.25rem 0 0; font-size: 1.75rem; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }
	.kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; }
	.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.inner-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.inner-table th, .inner-table td { padding: 0.45rem 0; border-bottom: 1px solid var(--border); text-align: left; }
	.inner-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); }
	.inner-table a { color: var(--accent); text-decoration: none; }
	.bar-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
	.bar-list li { display: grid; grid-template-columns: 100px 1fr 40px; gap: 0.5rem; align-items: center; font-size: 0.85rem; }
	.cat-label { text-transform: capitalize; color: var(--muted); }
	.cat-pct { text-align: right; font-weight: 600; }
	.bar-track { background: var(--surface-muted); border-radius: 999px; height: 8px; overflow: hidden; }
	.bar-fill { height: 100%; background: var(--accent); border-radius: 999px; transition: width 0.3s; }
	.cert-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
	.cert-list li { display: flex; gap: 0.4rem; align-items: center; font-size: 0.88rem; flex-wrap: wrap; }
	.cert-list a { color: var(--accent); text-decoration: none; }
	.empty { margin: 0; color: var(--muted); font-size: 0.88rem; }
	@media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }
</style>
