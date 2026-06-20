<script lang="ts">
	import '$lib/styles/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { modules } from '$lib/stores/navigation';

	let { children } = $props();

	function isActive(moduleHref: string): boolean {
		const path = $page.url.pathname;
		if (moduleHref === '/') return path === '/';
		return path.startsWith(moduleHref);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Engineering Ops Platform</title>
</svelte:head>

<div class="platform">
	<header class="platform__header">
		<a href="/" class="platform__header-brand">Engineering <span>Ops</span></a>
	</header>

	<aside class="platform__sidebar">
		<nav aria-label="Platform modules">
			{#each modules as mod}
				<a href={mod.href} class:active={isActive(mod.href)} title={mod.description}>
					<span class="nav-icon">{mod.icon}</span>
					{mod.label}
				</a>
			{/each}
		</nav>
	</aside>

	<main class="platform__main">
		{@render children()}
	</main>
</div>
