<script lang="ts">
	interface Props {
		value: string;
		placeholder?: string;
		onSearch: (query: string) => void;
	}

	let { value = $bindable(''), placeholder = 'Search...', onSearch }: Props = $props();

	let timer: ReturnType<typeof setTimeout>;

	function handleInput(e: Event) {
		const v = (e.target as HTMLInputElement).value;
		value = v;
		clearTimeout(timer);
		timer = setTimeout(() => onSearch(v), 250);
	}
</script>

<div class="search-input-wrap">
	<span class="search-input__icon" aria-hidden="true">🔍</span>
	<input
		class="search-input"
		type="search"
		{value}
		{placeholder}
		oninput={handleInput}
		aria-label={placeholder}
	/>
</div>

<style>
	.search-input-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input__icon {
		position: absolute;
		left: 0.75rem;
		font-size: 0.85rem;
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.6rem 0.85rem 0.6rem 2.2rem;
		font: inherit;
		font-size: 0.9rem;
		background: var(--surface);
		color: var(--ink);
	}

	.search-input:focus {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
		border-color: var(--accent);
	}
</style>
