<script lang="ts">
	import { goto } from '$app/navigation';
	import ProgressBar from '$lib/components/shared/ProgressBar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let filters = $state({ team: '', q: '' });
	$effect(() => { filters = { ...data.filters }; });

	function apply() {
		const p = new URLSearchParams();
		if (filters.team) p.set('team', filters.team);
		if (filters.q) p.set('q', filters.q);
		goto(`/training/employees?${p.toString()}`);
	}
	function reset() { filters = { team: '', q: '' }; goto('/training/employees'); }
</script>

<section class="emp-training-page">
	<header>
		<h2>Employee Training Profiles</h2>
		<p class="subtext">{data.employees.length} employee{data.employees.length !== 1 ? 's' : ''}</p>
	</header>

	<div class="panel filters">
		<label>Search<input bind:value={filters.q} placeholder="Name..." oninput={apply} /></label>
		<label>Team
			<select bind:value={filters.team} onchange={apply}>
				<option value="">All</option>
				{#each ['team-alpha','team-beacon','team-cirrus','team-delta'] as id}
					<option value={id}>{id.replace('team-', 'Team ').replace(/\b\w/g, c => c.toUpperCase())}</option>
				{/each}
			</select>
		</label>
		<button class="button" type="button" onclick={reset}>Reset</button>
	</div>

	<div class="panel">
		<table class="emp-table">
			<thead>
				<tr><th>Name</th><th>Team</th><th>Completion</th><th>Overdue</th><th>Certifications</th></tr>
			</thead>
			<tbody>
				{#if data.employees.length === 0}
					<tr><td colspan="5" class="empty">No employees matched.</td></tr>
				{:else}
					{#each data.employees as profile}
						<tr class="clickable" onclick={() => goto(`/training/employees/${profile.person.id}`)}>
							<td>
								<a href="/training/employees/{profile.person.id}" class="name-link">{profile.person.name}</a>
								<span class="role">{profile.person.role}</span>
							</td>
							<td>{profile.team.name}</td>
							<td class="progress-cell">
								<ProgressBar value={profile.completionRate} />
								<span class="pct">{profile.completionRate}%</span>
							</td>
							<td class:danger={profile.overdueCount > 0}>{profile.overdueCount}</td>
							<td>{profile.certifications.length}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</section>

<style>
	.emp-training-page { display: grid; gap: 1rem; max-width: 80rem; }
	h2 { margin: 0; }
	.subtext { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.88rem; }
	.filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; }
	label { display: grid; gap: 0.3rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
	input, select { border: 1px solid var(--border); border-radius: 999px; padding: 0.55rem 0.85rem; font: inherit; font-size: 0.85rem; background: var(--surface); }
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
	.danger { color: var(--danger); font-weight: 700; }
	.empty { text-align: center; color: var(--muted); padding: 2rem; }
</style>
