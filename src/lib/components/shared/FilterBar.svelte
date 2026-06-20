<script lang="ts">
	interface FilterDef {
		key: string;
		label: string;
		options: { value: string; label: string }[];
		value: string;
	}

	interface Props {
		filters: FilterDef[];
		onFilterChange: (key: string, value: string) => void;
		onReset: () => void;
	}

	let { filters, onFilterChange, onReset }: Props = $props();
</script>

<div class="filter-bar">
	{#each filters as filter}
		<label class="filter-bar__item">
			<span>{filter.label}</span>
			<select
				value={filter.value}
				onchange={(e) => onFilterChange(filter.key, (e.target as HTMLSelectElement).value)}
			>
				<option value="">All</option>
				{#each filter.options as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</label>
	{/each}
	<div class="filter-bar__actions">
		<button class="button" type="button" onclick={onReset}>Reset</button>
	</div>
</div>

<style>
	.filter-bar {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		align-items: flex-end;
	}

	.filter-bar__item {
		display: grid;
		gap: 0.3rem;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
	}

	select {
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.55rem 0.85rem;
		font: inherit;
		font-size: 0.85rem;
		background: var(--surface);
		color: var(--ink);
	}

	.filter-bar__actions { display: flex; align-items: flex-end; }
</style>
