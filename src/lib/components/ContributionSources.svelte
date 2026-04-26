<script lang="ts">
	import type { ContributionSource } from '$lib/types/kyp';

	interface Props {
		sources: ContributionSource[];
	}

	let { sources }: Props = $props();
</script>

<details class="panel contributions" open>
	<summary>Data sources contributing to your score</summary>
	<ul>
		{#each sources as source}
			<li>
				<div>
					<p>{source.label}</p>
					<small>{source.sourceType}</small>
				</div>
				<div>
					<strong>{source.count}</strong>
					<a href={source.link} target="_blank" rel="noreferrer">Source link</a>
				</div>
			</li>
		{/each}
	</ul>
</details>

<style>
	summary {
		cursor: pointer;
		font-weight: 700;
	}

	ul {
		list-style: none;
		padding: 0.65rem 0 0;
		margin: 0;
		display: grid;
		gap: 0.45rem;
	}

	li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		border: 1px solid var(--border);
		background: var(--surface-alt);
		border-radius: 4px;
		padding: 0.75rem 0.85rem;
	}

	p,
	small {
		margin: 0;
	}

	a {
		display: block;
		font-size: 0.8rem;
		margin-top: 0.2rem;
	}
</style>
