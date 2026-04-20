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

		return sortDirection === 'asc' ? '↑' : '↓';
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
			{#each rows as row}
				<tr>
					<td class="sticky">
						<div class="user-cell">
							<span class="avatar">{row.avatarInitials}</span>
							<div>
								<p>{row.displayName}</p>
								<small>{row.roleLevel}</small>
							</div>
						</div>
					</td>
					<td>{row.compositeScore.toFixed(1)}</td>
					<td>{row.commitsPerWeek.toFixed(1)}</td>
					<td>{row.prThroughput.toFixed(1)}</td>
					<td>{row.reviewEngagement.toFixed(1)}</td>
					<td>{row.impactScore.toFixed(1)}</td>
					<td>{row.codeQualityScore.toFixed(1)}</td>
				</tr>
			{/each}
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
		padding: 0.65rem 0.55rem;
		border-bottom: 1px solid var(--border);
		text-align: right;
		background: var(--surface);
	}

	th {
		position: sticky;
		top: 0;
		z-index: 3;
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
	}

	.user-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.user-cell p {
		margin: 0;
		font-weight: 700;
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
		font-size: 0.75rem;
		font-weight: 800;
	}
</style>
