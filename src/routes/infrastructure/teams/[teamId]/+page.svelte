<script lang="ts">
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import type { InfraAsset } from '$lib/types/infrastructure';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="team-infra-detail">
	<div class="breadcrumb">
		<a href="/infrastructure">Infrastructure</a>
		<span>›</span>
		<a href="/infrastructure/teams">Teams</a>
		<span>›</span>
		<span>{data.infra.team.name}</span>
	</div>

	<header>
		<h2>{data.infra.team.name}</h2>
		<p class="subtext">Infrastructure overview for this team.</p>
	</header>

	{#snippet assetSection(title: string, assets: InfraAsset[])}
		<section class="panel">
			<h3>{title} <span class="count">({assets.length})</span></h3>
			{#if assets.length === 0}
				<p class="empty">None.</p>
			{:else}
				<table class="asset-table">
					<thead>
						<tr><th>Name</th><th>Type</th><th>Environment</th><th>Criticality</th></tr>
					</thead>
					<tbody>
						{#each assets as asset}
							<tr>
								<td><a href="/infrastructure/assets/{asset.id}">{asset.name}</a></td>
								<td class="type-cell">{asset.type.replace(/_/g, ' ')}</td>
								<td>{asset.environment}</td>
								<td><StatusBadge status={asset.criticality} variant={asset.criticality === 'critical' ? 'danger' : asset.criticality === 'high' ? 'warning' : 'neutral'} /></td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</section>
	{/snippet}

	{@render assetSection('Owned Assets', data.infra.ownedAssets)}
	{@render assetSection('Consumed Assets', data.infra.consumedAssets)}
	{@render assetSection('Shared Resources', data.infra.sharedResources)}
</section>

<style>
	.team-infra-detail { display: grid; gap: 1rem; max-width: 80rem; }
	.breadcrumb { display: flex; gap: 0.4rem; align-items: center; font-size: 0.82rem; color: var(--muted); }
	.breadcrumb a { color: var(--accent); text-decoration: none; }
	.breadcrumb a:hover { text-decoration: underline; }
	h2 { margin: 0; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }
	.count { color: var(--muted); font-weight: 400; }
	.subtext { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.88rem; }
	.empty { color: var(--muted); margin: 0; font-size: 0.88rem; }
	.asset-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.asset-table th, .asset-table td { padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; }
	.asset-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); background: var(--surface-alt); }
	.asset-table a { color: var(--accent); text-decoration: none; }
	.asset-table a:hover { text-decoration: underline; }
	.type-cell { text-transform: capitalize; color: var(--muted); font-size: 0.82rem; }
</style>
