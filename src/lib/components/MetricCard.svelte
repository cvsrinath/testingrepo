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
		padding: 1rem;
		border-top: 3px solid var(--accent);
	}

	.metric-card__title {
		margin: 0;
		color: var(--muted);
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		font-weight: 700;
	}

	.metric-card__value {
		margin: 0.5rem 0 0.25rem;
		font-size: 1.7rem;
		font-weight: 800;
		line-height: 1.1;
	}

	.metric-card__subtitle {
		margin: 0;
		font-size: 0.8rem;
		color: var(--muted);
	}
</style>
