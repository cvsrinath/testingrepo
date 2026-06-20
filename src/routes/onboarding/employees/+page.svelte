<script lang="ts">
	import { goto } from '$app/navigation';
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import ProgressBar from '$lib/components/shared/ProgressBar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let status = $state('');
	let team = $state('');
	let q = $state('');

	$effect(() => {
		status = data.filters.status;
		team = data.filters.team;
		q = data.filters.q;
	});

	function applyFilters() {
		const params = new URLSearchParams();
		if (status) params.set('status', status);
		if (team) params.set('team', team);
		if (q) params.set('q', q);
		goto(`/onboarding/employees?${params.toString()}`);
	}

	function reset() {
		status = ''; team = ''; q = '';
		goto('/onboarding/employees');
	}
</script>

<section class="employees-page">
	<header>
		<h2>Onboarding Employees</h2>
		<p class="subtext">{data.employees.length} record{data.employees.length !== 1 ? 's' : ''}</p>
	</header>

	<div class="panel filters">
		<label>
			Search
			<input bind:value={q} placeholder="Name..." oninput={applyFilters} />
		</label>
		<label>
			Status
			<select bind:value={status} onchange={applyFilters}>
				<option value="">All</option>
				<option value="not_started">Not Started</option>
				<option value="in_progress">In Progress</option>
				<option value="completed">Completed</option>
				<option value="blocked">Blocked</option>
			</select>
		</label>
		<label>
			Team
			<select bind:value={team} onchange={applyFilters}>
				<option value="">All</option>
				<option value="team-alpha">Team Alpha</option>
				<option value="team-beacon">Team Beacon</option>
				<option value="team-cirrus">Team Cirrus</option>
				<option value="team-delta">Team Delta</option>
			</select>
		</label>
		<button class="button" type="button" onclick={reset}>Reset</button>
	</div>

	<div class="panel">
		<table class="emp-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Team</th>
					<th>Start Date</th>
					<th>Status</th>
					<th>Progress</th>
					<th>Manager</th>
					<th>Type</th>
				</tr>
			</thead>
			<tbody>
				{#if data.employees.length === 0}
					<tr><td colspan="7" class="empty">No employees matched the filters.</td></tr>
				{:else}
					{#each data.employees as emp}
						<tr onclick={() => goto(`/onboarding/employees/${emp.person.id}`)} class="clickable">
							<td>
								<a href="/onboarding/employees/{emp.person.id}" class="name-link">{emp.person.name}</a>
								<span class="role">{emp.person.role}</span>
							</td>
							<td>{emp.team.name}</td>
							<td>{emp.startDate}</td>
							<td><StatusBadge status={emp.status} /></td>
							<td class="progress-cell">
								<ProgressBar value={emp.completionPercent} />
								<span class="pct">{emp.completionPercent}%</span>
							</td>
							<td>{emp.manager.name}</td>
							<td>{emp.employmentType.replace('_', ' ')}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</section>

<style>
	.employees-page { display: grid; gap: 1rem; max-width: 80rem; }
	h2 { margin: 0; }
	.subtext { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.88rem; }

	.filters {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		align-items: flex-end;
	}

	label {
		display: grid;
		gap: 0.3rem;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
	}

	input, select {
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.55rem 0.85rem;
		font: inherit;
		font-size: 0.85rem;
		background: var(--surface);
	}

	.emp-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.emp-table th, .emp-table td { padding: 0.7rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; }
	.emp-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); background: var(--surface-alt); }
	tr.clickable { cursor: pointer; }
	tr.clickable:hover td { background: var(--surface-muted); }

	.name-link { font-weight: 600; text-decoration: none; color: var(--ink); display: block; }
	.name-link:hover { color: var(--accent); }
	.role { font-size: 0.78rem; color: var(--muted); }

	.progress-cell { display: flex; align-items: center; gap: 0.5rem; min-width: 120px; }
	.pct { font-size: 0.78rem; color: var(--muted); white-space: nowrap; }

	.empty { text-align: center; color: var(--muted); padding: 2rem; }
</style>
