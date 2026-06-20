<script lang="ts">
	interface Props {
		title: string;
		message: string;
		icon?: string;
	}

	let { title, message, icon }: Props = $props();
</script>

<div class="empty-state">
	{#if icon}<span class="empty-state__icon">{icon}</span>{/if}
	<h3 class="empty-state__title">{title}</h3>
	<p class="empty-state__message">{message}</p>
</div>

<style>
	.empty-state {
		display: grid;
		justify-items: center;
		gap: 0.5rem;
		padding: 3rem 2rem;
		text-align: center;
		color: var(--muted);
	}

	.empty-state__icon { font-size: 2.5rem; line-height: 1; }

	.empty-state__title {
		margin: 0;
		font-size: 1.1rem;
		color: var(--ink);
	}

	.empty-state__message {
		margin: 0;
		font-size: 0.9rem;
		max-width: 36rem;
	}
</style>
