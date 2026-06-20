<script lang="ts">
	interface Column {
		key: string;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'right' | 'center';
	}

	interface Props {
		columns: Column[];
		rows: Record<string, unknown>[];
		sortKey?: string;
		sortDirection?: 'asc' | 'desc';
		onSort?: (key: string) => void;
		onRowClick?: (row: Record<string, unknown>) => void;
	}

	let { columns, rows, sortKey, sortDirection = 'asc', onSort, onRowClick }: Props = $props();
</script>

<div class="data-table-wrap">
	<table class="data-table">
		<thead>
			<tr>
				{#each columns as col}
					<th
						style:text-align={col.align ?? 'left'}
						class:sortable={col.sortable}
						class:sorted={sortKey === col.key}
						onclick={() => col.sortable && onSort?.(col.key)}
					>
						{col.label}
						{#if col.sortable && sortKey === col.key}
							<span class="sort-arrow">{sortDirection === 'asc' ? '↑' : '↓'}</span>
						{/if}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if rows.length === 0}
				<tr>
					<td colspan={columns.length} class="empty-row">No records found.</td>
				</tr>
			{:else}
				{#each rows as row}
					<tr
						class:clickable={!!onRowClick}
						onclick={() => onRowClick?.(row)}
						tabindex={onRowClick ? 0 : undefined}
						onkeydown={(e) => e.key === 'Enter' && onRowClick?.(row)}
					>
						{#each columns as col}
							<td style:text-align={col.align ?? 'left'}>
								{row[col.key] ?? '—'}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>

<style>
	.data-table-wrap { overflow-x: auto; }

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th, td {
		padding: 0.75rem 0.85rem;
		border-bottom: 1px solid var(--border);
		text-align: left;
	}

	th {
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
		background: var(--surface-alt);
		white-space: nowrap;
	}

	th.sortable { cursor: pointer; user-select: none; }
	th.sortable:hover { color: var(--ink); }
	th.sorted { color: var(--accent); }

	.sort-arrow { margin-left: 0.3rem; }

	tr.clickable { cursor: pointer; }
	tr.clickable:hover td { background: var(--surface-muted); }

	.empty-row {
		text-align: center;
		color: var(--muted);
		padding: 2rem;
	}
</style>
