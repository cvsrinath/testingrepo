<script lang="ts">
	import { page } from '$app/stores';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const navItems = [
		{ href: '/reports', label: 'Overview', exact: true },
		{ href: '/reports/quarterly', label: 'Quarterly' },
		{ href: '/reports/teams', label: 'By Team' },
	];

	function isActive(href: string, exact = false) {
		return exact ? $page.url.pathname === href : $page.url.pathname.startsWith(href);
	}
</script>

<div class="module-layout">
	<nav class="module-nav">
		{#each navItems as item}
			<a href={item.href} class:active={isActive(item.href, item.exact)}>{item.label}</a>
		{/each}
	</nav>
	<main class="module-main">
		{@render children()}
	</main>
</div>

<style>
	.module-layout { display: grid; grid-template-rows: auto 1fr; height: 100%; }
	.module-main { padding: 1.5rem 2rem; overflow-y: auto; }
</style>
