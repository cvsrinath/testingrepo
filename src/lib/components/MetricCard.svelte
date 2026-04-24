<script lang="ts">
	interface Props {
		title: string;
		value: string | number;
		subtitle?: string;
		testId?: string;
	}

	let { title, value, subtitle = '', testId = '' }: Props = $props();
</script>

<article class="metric-card panel" data-testid={testId || undefined}>
	<p class="metric-card__title">{title}</p>
	<p class="metric-card__value">{value}</p>
	{#if subtitle}
		<p class="metric-card__subtitle">{subtitle}</p>
	{/if}
</article>

<style>
	.metric-card {
		padding: 0.9rem;
	}

	.metric-card__title {
		margin: 0;
		color: var(--muted);
		font-size: 0.85rem;
	}

	.metric-card__value {
		margin: 0.4rem 0;
		font-size: 1.5rem;
		font-weight: 800;
	}

	.metric-card__subtitle {
		margin: 0;
		font-size: 0.8rem;
		color: var(--muted);
	}
</style>
