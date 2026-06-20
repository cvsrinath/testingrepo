<script lang="ts">
	interface Props {
		value: number;
		label?: string;
		variant?: 'default' | 'success' | 'warning' | 'danger';
	}

	let { value, label, variant = 'default' }: Props = $props();
	const clamped = $derived(Math.max(0, Math.min(100, value)));
</script>

<div class="progress-wrap">
	{#if label}
		<div class="progress-label">
			<span>{label}</span>
			<span>{clamped}%</span>
		</div>
	{/if}
	<div class="progress-track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
		<div class="progress-fill progress-fill--{variant}" style="width: {clamped}%"></div>
	</div>
</div>

<style>
	.progress-wrap { display: grid; gap: 0.3rem; }

	.progress-label {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--muted);
	}

	.progress-track {
		height: 8px;
		background: var(--surface-muted);
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 999px;
		transition: width 0.3s ease;
	}

	.progress-fill--default { background: var(--accent); }
	.progress-fill--success { background: #16a34a; }
	.progress-fill--warning { background: var(--warning); }
	.progress-fill--danger { background: var(--danger); }
</style>
