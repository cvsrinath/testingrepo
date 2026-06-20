<script lang="ts">
	import KpiCard from '$lib/components/shared/KpiCard.svelte';
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="infra-dash">
	<header>
		<p class="eyebrow">Module</p>
		<h2>Infrastructure</h2>
	</header>

	<div class="kpi-row">
		<KpiCard label="Total Assets" value={data.stats.totalAssets} />
		<KpiCard label="Critical Systems" value={data.stats.criticalSystems.length} />
		<KpiCard label="Ownership Coverage" value={`${data.stats.ownershipCoverage}%`} />
		<KpiCard label="Environments" value={data.stats.byEnvironment.length} />
	</div>

	<div class="dash-grid">
		<section class="panel">
			<h3>Assets by Type</h3>
			<ul class="breakdown-list">
				{#each data.stats.byType.sort((a, b) => b.count - a.count) as row}
					<li>
						<span class="breakdown-label">{row.type.replace(/_/g, ' ')}</span>
						<span class="breakdown-count">{row.count}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section class="panel">
			<h3>Assets by Environment</h3>
			<ul class="breakdown-list">
				{#each data.stats.byEnvironment as row}
					<li>
						<span class="breakdown-label">{row.environment}</span>
						<span class="breakdown-count">{row.count}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section class="panel">
			<h3>Critical Systems</h3>
			<ul class="asset-list">
				{#each data.stats.criticalSystems as asset}
					<li>
						<a href="/infrastructure/assets/{asset.id}">{asset.name}</a>
						<span class="owner">{asset.ownerTeam.name}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section class="panel">
			<h3>Recently Updated</h3>
			<ul class="asset-list">
				{#each data.stats.recentlyUpdated as asset}
					<li>
						<a href="/infrastructure/assets/{asset.id}">{asset.name}</a>
						<span class="owner">{asset.lastUpdated}</span>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</section>

<style>
	.infra-dash { display: grid; gap: 1.5rem; max-width: 80rem; }
	.eyebrow { margin: 0; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 700; }
	h2 { margin: 0.25rem 0 0; font-size: 1.75rem; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }

	.kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.75rem; }

	.dash-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

	.breakdown-list, .asset-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; }

	.breakdown-list li { display: flex; justify-content: space-between; padding: 0.4rem 0.6rem; background: var(--surface-alt); border-radius: 4px; font-size: 0.88rem; }
	.breakdown-label { text-transform: capitalize; }
	.breakdown-count { font-weight: 700; }

	.asset-list li { display: flex; justify-content: space-between; align-items: center; padding: 0.4rem 0; border-bottom: 1px solid var(--border); font-size: 0.88rem; gap: 0.5rem; }
	.asset-list li:last-child { border-bottom: none; }
	.asset-list a { color: var(--accent); text-decoration: none; }
	.asset-list a:hover { text-decoration: underline; }
	.owner { color: var(--muted); font-size: 0.78rem; white-space: nowrap; }

	@media (max-width: 768px) { .dash-grid { grid-template-columns: 1fr; } }
</style>
