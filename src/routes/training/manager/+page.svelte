<script lang="ts">
	import { goto } from '$app/navigation';
	import ProgressBar from '$lib/components/shared/ProgressBar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let selectedTeam = $state('team-alpha');
	$effect(() => { selectedTeam = data.selectedTeam; });

	function changeTeam() {
		goto(`/training/manager?team=${selectedTeam}`);
	}
</script>

<section class="manager-view">
	<header>
		<h2>Manager Training View</h2>
		<label class="team-picker">
			Team
			<select bind:value={selectedTeam} onchange={changeTeam}>
				{#each data.teams as team}
					<option value={team.id}>{team.name}</option>
				{/each}
			</select>
		</label>
	</header>

	<div class="panel team-summary">
		<div>
			<p class="eyebrow">Team Completion Rate</p>
			<strong class="big-rate">{data.view.teamCompletionRate}%</strong>
		</div>
		<div class="progress-wrap">
			<ProgressBar value={data.view.teamCompletionRate} variant={data.view.teamCompletionRate >= 80 ? 'success' : data.view.teamCompletionRate >= 60 ? 'default' : 'warning'} />
		</div>
	</div>

	<section class="panel">
		<h3>Team Members</h3>
		<table class="member-table">
			<thead>
				<tr><th>Name</th><th>Completion</th><th>Overdue</th><th>Upcoming Deadlines</th><th>Expiring Certs</th></tr>
			</thead>
			<tbody>
				{#each data.view.members as member}
					<tr>
						<td><a href="/training/employees/{member.person.id}">{member.person.name}</a></td>
						<td class="progress-cell">
							<ProgressBar value={member.completionRate} />
							<span class="pct">{member.completionRate}%</span>
						</td>
						<td class:danger={member.overdueCount > 0}>{member.overdueCount}</td>
						<td>{member.upcomingDeadlines}</td>
						<td class:warning={member.expiringCerts > 0}>{member.expiringCerts}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	{#if data.view.trainingGaps.length > 0}
		<section class="panel">
			<h3>Training Gaps (Required Courses)</h3>
			<table class="gap-table">
				<thead>
					<tr><th>Course</th><th>Members Missing</th></tr>
				</thead>
				<tbody>
					{#each data.view.trainingGaps as gap}
						<tr>
							<td><a href="/training/catalog/{gap.course.id}">{gap.course.title}</a></td>
							<td>{gap.missingCount} of {data.view.members.length}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/if}
</section>

<style>
	.manager-view { display: grid; gap: 1rem; max-width: 80rem; }
	header { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; }
	h2 { margin: 0; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }
	.team-picker { display: grid; gap: 0.3rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
	select { border: 1px solid var(--border); border-radius: 999px; padding: 0.55rem 0.85rem; font: inherit; font-size: 0.9rem; background: var(--surface); }
	.team-summary { display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; }
	.eyebrow { margin: 0; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 700; }
	.big-rate { font-size: 2.5rem; }
	.progress-wrap { flex: 1; min-width: 200px; }
	.member-table, .gap-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.member-table th, .member-table td, .gap-table th, .gap-table td { padding: 0.65rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; }
	.member-table th, .gap-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); background: var(--surface-alt); }
	.member-table a, .gap-table a { color: var(--accent); text-decoration: none; }
	.member-table a:hover, .gap-table a:hover { text-decoration: underline; }
	.progress-cell { display: flex; align-items: center; gap: 0.5rem; min-width: 120px; }
	.pct { font-size: 0.78rem; color: var(--muted); white-space: nowrap; }
	.danger { color: var(--danger); font-weight: 700; }
	.warning { color: var(--warning); font-weight: 700; }
</style>
