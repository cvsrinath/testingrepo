<script lang="ts">
	import { metricLabels } from '$lib/mock/kypData';
	import type { EmployeeSummary, SortDirection, SortableMetric } from '$lib/types/kyp';

	interface Props {
		rows: EmployeeSummary[];
		sortKey: SortableMetric;
		sortDirection: SortDirection;
		onSort: (key: SortableMetric) => void;
	}

	let { rows, sortKey, sortDirection, onSort }: Props = $props();

	const columns: SortableMetric[] = [
		'compositeScore',
		'commitsPerWeek',
		'prThroughput',
		'reviewEngagement',
		'impactScore',
		'codeQualityScore'
	];

	function sortIndicator(column: SortableMetric): string {
		if (sortKey !== column) {
			return '';
		}

		return sortDirection === 'asc' ? '(asc)' : '(desc)';
	}
</script>

<div class="table-wrap panel" data-testid="team-roster-table">
	<table>
		<thead>
			<tr>
				<th class="sticky">Employee</th>
				{#each columns as column}
					<th>
						<button class="header-sort" onclick={() => onSort(column)}>
							{metricLabels[column]} {sortIndicator(column)}
						</button>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if rows.length === 0}
				<tr>
					<td class="empty-state" colspan={columns.length + 1}>No team members match the current filter.</td>
				</tr>
			{:else}
				{#each rows as row}
					<tr>
						<td class="sticky">
							<a class="cell-link user-cell" href={`/employees/${row.userId}`}>
								<span class="avatar">{row.avatarInitials}</span>
								<div>
									<p>{row.displayName}</p>
									<small>{row.roleLevel}</small>
								</div>
							</a>
						</td>
						<td data-testid={`composite-${row.userId}`}>
							<a class="cell-link" href={`/employees/${row.userId}`}>{row.compositeScore.toFixed(1)}</a>
						</td>
						<td><a class="cell-link" href={`/employees/${row.userId}`}>{row.commitsPerWeek.toFixed(1)}</a></td>
						<td><a class="cell-link" href={`/employees/${row.userId}`}>{row.prThroughput.toFixed(1)}</a></td>
						<td><a class="cell-link" href={`/employees/${row.userId}`}>{row.reviewEngagement.toFixed(1)}</a></td>
						<td><a class="cell-link" href={`/employees/${row.userId}`}>{row.impactScore.toFixed(1)}</a></td>
						<td><a class="cell-link" href={`/employees/${row.userId}`}>{row.codeQualityScore.toFixed(1)}</a></td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<style>
	.table-wrap {
		overflow: auto;
		max-height: 30rem;
	}

	table {
		border-collapse: collapse;
		width: 100%;
		min-width: 58rem;
		font-size: 0.88rem;
	}

	th,
	td {
		padding: 0.75rem 0.7rem;
		border-bottom: 1px solid var(--border);
		text-align: right;
		background: var(--surface);
	}

	th {
		position: sticky;
		top: 0;
		z-index: 3;
		background: var(--surface-alt);
	}

	.sticky {
		position: sticky;
		left: 0;
		text-align: left;
		z-index: 2;
		background: var(--surface);
	}

	.header-sort {
		border: 0;
		background: transparent;
		font-weight: 700;
		cursor: pointer;
		color: var(--ink);
		padding: 0;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.cell-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		color: inherit;
		text-decoration: none;
	}

	td:not(.sticky) .cell-link {
		justify-content: end;
	}

	.cell-link:hover {
		color: var(--accent-strong);
		text-decoration: none;
	}

	.user-cell p {
		margin: 0;
		font-weight: 700;
	}

	.empty-state {
		text-align: center;
		color: var(--muted);
		padding: 2rem;
	}

	.user-cell small {
		color: var(--muted);
	}

	.avatar {
		width: 2rem;
		height: 2rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--surface-alt);
		border: 1px solid var(--border);
		font-size: 0.75rem;
		font-weight: 800;
		color: var(--accent);
	}

	tbody tr:hover td {
		background: #fbfdff;
	}
</style>
