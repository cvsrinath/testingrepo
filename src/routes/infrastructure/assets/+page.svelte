<script lang="ts">
	import { goto } from '$app/navigation';
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let filters = $state({ type: '', environment: '', criticality: '', ownerTeam: '', q: '' });

	$effect(() => { filters = { ...data.filters }; });

	function apply() {
		const p = new URLSearchParams();
		if (filters.type) p.set('type', filters.type);
		if (filters.environment) p.set('environment', filters.environment);
		if (filters.criticality) p.set('criticality', filters.criticality);
		if (filters.ownerTeam) p.set('ownerTeam', filters.ownerTeam);
		if (filters.q) p.set('q', filters.q);
		goto(`/infrastructure/assets?${p.toString()}`);
	}

	function reset() {
		filters = { type: '', environment: '', criticality: '', ownerTeam: '', q: '' };
		goto('/infrastructure/assets');
	}
</script>

<section class="assets-page">
	<header>
		<h2>Asset Directory</h2>
		<p class="subtext">{data.assets.length} asset{data.assets.length !== 1 ? 's' : ''}</p>
	</header>

	<div class="panel filters">
		<label>Search<input bind:value={filters.q} placeholder="Name or description..." oninput={apply} /></label>
		<label>Type
			<select bind:value={filters.type} onchange={apply}>
				<option value="">All</option>
				{#each ['cloud_project','kubernetes_cluster','database','repository','cicd_pipeline','monitoring','internal_service','shared_platform'] as t}
					<option value={t}>{t.replace(/_/g, ' ')}</option>
				{/each}
			</select>
		</label>
		<label>Environment
			<select bind:value={filters.environment} onchange={apply}>
				<option value="">All</option>
				{#each ['production','staging','development','shared'] as e}
					<option value={e}>{e}</option>
				{/each}
			</select>
		</label>
		<label>Criticality
			<select bind:value={filters.criticality} onchange={apply}>
				<option value="">All</option>
				{#each ['critical','high','medium','low'] as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
		</label>
		<label>Owner Team
			<select bind:value={filters.ownerTeam} onchange={apply}>
				<option value="">All</option>
				{#each ['team-alpha','team-beacon','team-cirrus','team-delta'] as id}
					<option value={id}>{id.replace('team-', 'Team ').replace(/\b\w/g, c => c.toUpperCase())}</option>
				{/each}
			</select>
		</label>
		<button class="button" type="button" onclick={reset}>Reset</button>
	</div>

	<div class="panel">
		<table class="asset-table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Environment</th>
					<th>Criticality</th>
					<th>Owner Team</th>
					<th>Dependencies</th>
					<th>Updated</th>
				</tr>
			</thead>
			<tbody>
				{#if data.assets.length === 0}
					<tr><td colspan="7" class="empty">No assets matched.</td></tr>
				{:else}
					{#each data.assets as asset}
						<tr class="clickable" onclick={() => goto(`/infrastructure/assets/${asset.id}`)}>
							<td><a href="/infrastructure/assets/{asset.id}" class="asset-link">{asset.name}</a></td>
							<td class="type-cell">{asset.type.replace(/_/g, ' ')}</td>
							<td>{asset.environment}</td>
							<td><StatusBadge status={asset.criticality} variant={asset.criticality === 'critical' ? 'danger' : asset.criticality === 'high' ? 'warning' : 'neutral'} /></td>
							<td>{asset.ownerTeam.name}</td>
							<td>{asset.dependencies.length}</td>
							<td>{asset.lastUpdated}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</section>

<style>
	.assets-page { display: grid; gap: 1rem; max-width: 90rem; }
	h2 { margin: 0; }
	.subtext { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.88rem; }

	.filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; }
	label { display: grid; gap: 0.3rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
	input, select { border: 1px solid var(--border); border-radius: 999px; padding: 0.55rem 0.85rem; font: inherit; font-size: 0.85rem; background: var(--surface); }

	.asset-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.asset-table th, .asset-table td { padding: 0.7rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; }
	.asset-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); background: var(--surface-alt); }
	tr.clickable { cursor: pointer; }
	tr.clickable:hover td { background: var(--surface-muted); }
	.asset-link { font-weight: 600; text-decoration: none; color: var(--ink); }
	.asset-link:hover { color: var(--accent); }
	.type-cell { text-transform: capitalize; color: var(--muted); font-size: 0.82rem; }
	.empty { text-align: center; color: var(--muted); padding: 2rem; }
</style>
