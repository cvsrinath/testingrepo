<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="teams-infra">
	<header>
		<h2>Team Infrastructure</h2>
		<p class="subtext">Overview of infrastructure ownership and consumption per team.</p>
	</header>

	<div class="panel">
		<table class="teams-table">
			<thead>
				<tr>
					<th>Team</th>
					<th>Owned Assets</th>
					<th>Consumed Assets</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.teams as row}
					<tr class="clickable" onclick={() => goto(`/infrastructure/teams/${row.team.id}`)}>
						<td><strong>{row.team.name}</strong></td>
						<td>{row.ownedCount}</td>
						<td>{row.consumedCount}</td>
						<td><a href="/infrastructure/teams/{row.team.id}" class="view-link">View →</a></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>

<style>
	.teams-infra { display: grid; gap: 1rem; max-width: 60rem; }
	h2 { margin: 0; }
	.subtext { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.88rem; }
	.teams-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
	.teams-table th, .teams-table td { padding: 0.75rem 0.85rem; border-bottom: 1px solid var(--border); text-align: left; }
	.teams-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); background: var(--surface-alt); }
	tr.clickable { cursor: pointer; }
	tr.clickable:hover td { background: var(--surface-muted); }
	.view-link { color: var(--accent); text-decoration: none; font-size: 0.85rem; }
</style>
