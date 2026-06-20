<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const totalPages = $derived(Math.max(1, Math.ceil(data.result.total / data.result.pageSize)));

	function pageHref(page: number): string {
		const params = new URLSearchParams();
		if (data.filters.q) params.set('q', data.filters.q);
		if (data.filters.region) params.set('region', data.filters.region);
		if (data.filters.sizeBucket) params.set('size_bucket', data.filters.sizeBucket);
		if (data.filters.active) params.set('active', data.filters.active);
		if (data.filters.stack) params.set('stack', data.filters.stack);
		if (data.filters.scoreMin) params.set('score_min', data.filters.scoreMin);
		if (data.filters.sort) params.set('sort', data.filters.sort);
		params.set('page', String(page));
		params.set('page_size', String(data.filters.pageSize));
		return `/teams?${params.toString()}`;
	}
</script>

<section class="teams-page">
	<header class="panel teams-header">
		<div>
			<p class="eyebrow">Organization Teams</p>
			<h2>Browse Global Delivery Teams</h2>
			<p class="subtext">
				Search by team, team ID, or member name. Combine filters to narrow the org-wide roster.
			</p>
		</div>
		<div class="header-meta">
			<p><strong>Active sources</strong> {Object.values(data.scoringConfig.sources).filter((source) => source.enabled).length}</p>
			<p><strong>Scoring scope</strong> {data.scoringConfig.scopeType}</p>
			<a class="button" href="/admin/scoring">Admin scoring</a>
		</div>
	</header>

	<form class="panel filters" method="GET">
		<div class="search-block">
			<label>
				Search
				<input name="q" value={data.filters.q} placeholder="Team name, team ID, or member" />
			</label>
			{#if data.result.suggestions.length > 0}
				<div class="suggestions" data-testid="team-typeahead">
					{#each data.result.suggestions as suggestion}
						<a
							class="suggestion-row"
							href={suggestion.type === 'team' ? `/teams/${suggestion.id}` : `/employees/${suggestion.id}`}
						>
							<strong>{suggestion.label}</strong>
							<span>{suggestion.meta}</span>
						</a>
					{/each}
				</div>
			{/if}
		</div>

		<label>
			Region
			<select name="region" value={data.filters.region}>
				<option value="">All</option>
				{#each data.result.availableRegions as region}
					<option value={region}>{region}</option>
				{/each}
			</select>
		</label>

		<label>
			Size bucket
			<select name="size_bucket" value={data.filters.sizeBucket}>
				<option value="">All</option>
				<option value="5-6">5-6</option>
				<option value="8-10">8-10</option>
				<option value="10-15">10-15</option>
				<option value="15-18">15-18</option>
			</select>
		</label>

		<label>
			Active
			<select name="active" value={data.filters.active}>
				<option value="">All</option>
				<option value="active">Active</option>
				<option value="inactive">Inactive</option>
			</select>
		</label>

		<label>
			Tech stack
			<select name="stack" value={data.filters.stack}>
				<option value="">All</option>
				{#each data.result.availableStacks as stack}
					<option value={stack}>{stack}</option>
				{/each}
			</select>
		</label>

		<label>
			Score min
			<input name="score_min" type="number" min="0" max="100" step="1" value={data.filters.scoreMin} />
		</label>

		<label>
			Sort
			<select name="sort" value={data.filters.sort}>
				<option value="score_desc">Score desc</option>
				<option value="relevance">Relevance</option>
				<option value="name_asc">Name asc</option>
				<option value="last_activity_desc">Last activity desc</option>
			</select>
		</label>

		<input type="hidden" name="page" value="1" />
		<input type="hidden" name="page_size" value={data.filters.pageSize} />

		<div class="filter-actions">
			<button class="button button--primary" type="submit">Apply filters</button>
			<a class="button" href="/teams">Clear</a>
		</div>
	</form>

	<section class="panel results">
		<div class="results__meta">
			<p><strong>{data.result.total}</strong> teams matched</p>
			<p>Page {data.result.page} of {totalPages}</p>
		</div>

		<div class="results__table">
			<table data-testid="teams-table">
				<thead>
					<tr>
						<th>Team</th>
						<th>Region</th>
						<th>Size</th>
						<th>Bucket</th>
						<th>Score</th>
						<th>Last Deployment</th>
						<th>Stack</th>
					</tr>
				</thead>
				<tbody>
					{#if data.result.items.length === 0}
						<tr>
							<td colspan="7" class="empty-state">No teams matched the current filters.</td>
						</tr>
					{:else}
						{#each data.result.items as team}
							{@const scoreTitle = `Score breakdown — sources: ${Object.entries(data.scoringConfig.sources).filter(([, s]) => s.enabled).map(([, s]) => s.label).join(', ')}`}
							<tr class:inactive-row={!team.activeFlag}>
								<td>
									<a href={`/teams/${team.teamId}`} class="team-link">
										<strong>
											{team.name}
											{#if !team.activeFlag}<span class="inactive-badge">Inactive</span>{/if}
										</strong>
										<span>{team.teamId}</span>
									</a>
								</td>
								<td>{team.region}</td>
								<td>{team.memberCount}</td>
								<td>{team.sizeBucket}</td>
								<td title={scoreTitle}>{team.aggregatedScore}</td>
								<td>{new Date(team.lastDeploymentAt).toLocaleDateString()}</td>
								<td>{team.techStack.join(', ')}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<div class="pagination">
			<a class="button" href={pageHref(Math.max(1, data.result.page - 1))} aria-disabled={data.result.page <= 1}>
				Previous
			</a>
			<a class="button" href={pageHref(Math.min(totalPages, data.result.page + 1))} aria-disabled={data.result.page >= totalPages}>
				Next
			</a>
		</div>
	</section>
</section>

<style>
	.teams-page {
		display: grid;
		gap: 1rem;
	}

	.teams-header,
	.results__meta,
	.pagination {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		font-weight: 700;
	}

	h2,
	.subtext,
	.header-meta p {
		margin: 0;
	}

	.subtext,
	.header-meta {
		color: var(--muted);
	}

	.header-meta {
		display: grid;
		gap: 0.5rem;
		align-content: start;
	}

	.filters {
		display: grid;
		grid-template-columns: minmax(16rem, 2fr) repeat(6, minmax(8rem, 1fr));
		gap: 0.85rem;
		align-items: start;
	}

	label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	input,
	select {
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.6rem 0.85rem;
		font: inherit;
		background: var(--surface);
		color: var(--ink);
	}

	.search-block {
		display: grid;
		gap: 0.5rem;
	}

	.suggestions {
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 0.6rem 0.75rem;
		background: var(--surface-alt);
	}

	.suggestion-row {
		display: flex;
		justify-content: space-between;
		gap: 0.75rem;
		font-size: 0.86rem;
		text-decoration: none;
		color: inherit;
		padding: 0.2rem 0;
	}

	.suggestion-row + .suggestion-row {
		margin-top: 0.25rem;
		border-top: 1px solid var(--border);
		padding-top: 0.35rem;
	}

	.suggestion-row:hover strong {
		color: var(--accent);
		text-decoration: underline;
	}

	.suggestion-row span {
		color: var(--muted);
	}

	.filter-actions {
		display: flex;
		gap: 0.5rem;
		align-items: end;
	}

	.results__table {
		overflow: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 54rem;
	}

	th,
	td {
		padding: 0.85rem 0.7rem;
		border-bottom: 1px solid var(--border);
		text-align: left;
	}

	th {
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
		background: var(--surface-alt);
	}

	.team-link {
		display: grid;
		gap: 0.15rem;
		text-decoration: none;
		color: inherit;
	}

	.team-link span {
		color: var(--muted);
		font-size: 0.82rem;
	}

	.inactive-row td {
		opacity: 0.6;
	}

	.inactive-badge {
		display: inline-block;
		margin-left: 0.4rem;
		font-size: 0.68rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		background: var(--surface-alt);
		border: 1px solid var(--border);
		border-radius: 4px;
		padding: 0.05rem 0.3rem;
		color: var(--muted);
		vertical-align: middle;
	}

	.empty-state {
		text-align: center;
		color: var(--muted);
	}

	.pagination {
		margin-top: 1rem;
	}

	@media (max-width: 1200px) {
		.filters {
			grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		}
	}
</style>
