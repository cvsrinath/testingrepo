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
		padding: 0.55rem;
		border-radius: 8px;
		font-size: 0.85rem;
	}

	.info {
		background: rgba(31, 111, 91, 0.12);
	}

	.warning {
		background: rgba(196, 122, 18, 0.18);
	}

	.critical {
		background: rgba(184, 65, 53, 0.16);
	}
</style>
