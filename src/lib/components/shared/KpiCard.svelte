<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
		subtitle?: string;
		trend?: 'up' | 'down' | 'flat';
		change?: string;
	}

	let { label, value, subtitle, trend, change }: Props = $props();
</script>

<article class="kpi-card panel">
	<span class="kpi-card__label">{label}</span>
	<strong class="kpi-card__value">{value}</strong>
	{#if change || trend}
		<span class="kpi-card__change" class:up={trend === 'up'} class:down={trend === 'down'}>
			{#if trend === 'up'}↑{:else if trend === 'down'}↓{/if}
			{change ?? ''}
		</span>
	{/if}
	{#if subtitle}
		<p class="kpi-card__subtitle">{subtitle}</p>
	{/if}
</article>

<style>
	.kpi-card {
		display: grid;
		gap: 0.25rem;
	}

	.kpi-card__label {
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
	}

	.kpi-card__value {
		font-size: 2rem;
		line-height: 1.1;
		color: var(--ink);
	}

	.kpi-card__change {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--muted);
	}

	.kpi-card__change.up { color: #16a34a; }
	.kpi-card__change.down { color: var(--danger); }

	.kpi-card__subtitle {
		margin: 0;
		font-size: 0.8rem;
		color: var(--muted);
	}
</style>
