<script lang="ts">
	import type { AlertItem } from '$lib/types/kyp';

	interface Props {
		alerts: AlertItem[];
	}

	let { alerts }: Props = $props();

	function classFor(severity: AlertItem['severity']): string {
		if (severity === 'critical') {
			return 'critical';
		}
		if (severity === 'warning') {
			return 'warning';
		}
		return 'info';
	}
</script>

<section class="panel alerts" data-testid="alerts">
	<h3>Alert Panel</h3>
	<ul>
		{#each alerts as alert}
			<li class={classFor(alert.severity)}>
				<strong>{alert.severity.toUpperCase()}</strong>
				<span>{alert.text}</span>
			</li>
		{/each}
	</ul>
</section>

<style>
	.alerts h3 {
		margin-top: 0;
		margin-bottom: 0.85rem;
	}

	ul {
		padding: 0;
		margin: 0;
		list-style: none;
		display: grid;
		gap: 0.45rem;
	}

	li {
		display: flex;
		gap: 0.5rem;
		padding: 0.75rem 0.85rem;
		border-radius: 4px;
		font-size: 0.85rem;
		border: 1px solid var(--border);
		border-left-width: 4px;
	}

	.info {
		background: #f6f9ff;
		border-left-color: var(--accent);
	}

	.warning {
		background: #fff9ef;
		border-left-color: var(--warning);
	}

	.critical {
		background: #fff4f2;
		border-left-color: var(--danger);
	}
</style>
