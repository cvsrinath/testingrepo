<script lang="ts">
	import { page } from '$app/stores';

	let { children } = $props();

	const navLinks = [
		{ href: '/kyp', label: 'Overview', exact: true },
		{ href: '/kyp/teams', label: 'Teams' },
		{ href: '/kyp/supervisor', label: 'Supervisor' },
		{ href: '/kyp/admin/scoring', label: 'Admin' },
	];

	function isActive(href: string, exact = false): boolean {
		const path = $page.url.pathname;
		return exact ? path === href : path.startsWith(href);
	}
</script>

<div class="kyp-module">
	<nav class="module-nav" aria-label="KYP module">
		{#each navLinks as link}
			<a href={link.href} class:active={isActive(link.href, link.exact)}>{link.label}</a>
		{/each}
	</nav>
	{@render children()}
</div>
