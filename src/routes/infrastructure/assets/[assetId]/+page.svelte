<script lang="ts">
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const asset = $derived(data.asset);
</script>

<section class="asset-detail">
	<div class="breadcrumb">
		<a href="/infrastructure">Infrastructure</a>
		<span>›</span>
		<a href="/infrastructure/assets">Assets</a>
		<span>›</span>
		<span>{asset.name}</span>
	</div>

	<div class="panel info-card">
		<div>
			<p class="eyebrow">{asset.type.replace(/_/g, ' ')}</p>
			<h2>{asset.name}</h2>
			<p class="desc">{asset.description}</p>
			{#if asset.url}
				<a href={asset.url} target="_blank" rel="noopener" class="url-link">{asset.url}</a>
			{/if}
		</div>
		<div class="badges">
			<StatusBadge status={asset.criticality} variant={asset.criticality === 'critical' ? 'danger' : asset.criticality === 'high' ? 'warning' : 'neutral'} />
			<StatusBadge status={asset.environment} variant={asset.environment === 'production' ? 'info' : 'neutral'} />
		</div>
	</div>

	<div class="meta-grid">
		<section class="panel">
			<h3>Ownership</h3>
			<p><strong>Owner:</strong> <a href="/infrastructure/teams/{asset.ownerTeam.id}">{asset.ownerTeam.name}</a></p>
			{#if asset.consumedByTeams.length > 0}
				<p><strong>Consumed by:</strong> {asset.consumedByTeams.map(t => t.name).join(', ')}</p>
			{:else}
				<p class="muted">No other teams consume this asset.</p>
			{/if}
		</section>

		<section class="panel">
			<h3>Dependencies</h3>
			{#if asset.dependencies.length === 0}
				<p class="muted">No dependencies.</p>
			{:else}
				<ul class="dep-list">
					{#each asset.dependencies as dep}
						<li><a href="/infrastructure/assets/{dep.assetId}">{dep.assetName}</a></li>
					{/each}
				</ul>
			{/if}
		</section>

		<section class="panel">
			<h3>Tags</h3>
			<div class="tags">
				{#each asset.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
		</section>

		<section class="panel">
			<h3>Timestamps</h3>
			<p><strong>Created:</strong> {asset.createdAt}</p>
			<p><strong>Last Updated:</strong> {asset.lastUpdated}</p>
		</section>
	</div>
</section>

<style>
	.asset-detail { display: grid; gap: 1rem; max-width: 64rem; }

	.breadcrumb { display: flex; gap: 0.4rem; align-items: center; font-size: 0.82rem; color: var(--muted); }
	.breadcrumb a { color: var(--accent); text-decoration: none; }
	.breadcrumb a:hover { text-decoration: underline; }

	.info-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap; }
	.eyebrow { margin: 0; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 700; }
	h2 { margin: 0.2rem 0 0.5rem; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }
	.desc { margin: 0 0 0.5rem; color: var(--muted); font-size: 0.9rem; }
	.url-link { font-size: 0.82rem; color: var(--accent); }
	.badges { display: flex; gap: 0.5rem; align-items: flex-start; flex-shrink: 0; }

	.meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
	.meta-grid p { margin: 0 0 0.5rem; font-size: 0.88rem; }
	.muted { color: var(--muted); }

	.dep-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; }
	.dep-list li { font-size: 0.88rem; }
	.dep-list a { color: var(--accent); text-decoration: none; }
	.dep-list a:hover { text-decoration: underline; }

	.tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
	.tag { background: var(--surface-muted); border-radius: 4px; padding: 0.2rem 0.5rem; font-size: 0.75rem; color: var(--muted); }

	@media (max-width: 768px) { .meta-grid { grid-template-columns: 1fr; } }
</style>
