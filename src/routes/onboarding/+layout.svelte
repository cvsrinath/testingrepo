<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	const navLinks = [
		{ href: '/onboarding', label: 'Dashboard', exact: true },
		{ href: '/onboarding/employees', label: 'Employees' },
		{ href: '/onboarding/templates', label: 'Templates' },
	];

	function isActive(href: string, exact = false): boolean {
		const path = $page.url.pathname;
		return exact ? path === href : path.startsWith(href);
	}
</script>

<div>
	<nav class="module-nav" aria-label="Onboarding module">
		{#each navLinks as link}
			<a href={link.href} class:active={isActive(link.href, link.exact)}>{link.label}</a>
		{/each}
	</nav>
	{@render children()}
</div>
