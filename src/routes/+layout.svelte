<script lang="ts">
	import '$lib/styles/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { periodLabel, selectedPeriodLabel, lastUpdatedLabel } from '$lib/stores/period';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>KYP UI Prototype</title>
</svelte:head>

<div class="shell">
	<header class="shell__header">
		<div class="brand">
			<p class="brand__eyebrow">Know Your Performance</p>
			<h1>KYP UI Prototype</h1>
		</div>
		<nav class="shell__nav" aria-label="Primary">
			<a href="/teams">Teams</a>
			<a href="/teams/team-alpha">Team Detail</a>
			<a href="/employees/alex-rivera">Employee View</a>
			<a href="/admin/scoring">Admin</a>
		</nav>
		<div class="shell__meta">
			<p><span>Period</span> {$selectedPeriodLabel}</p>
			<p><span>Last Updated</span> {$lastUpdatedLabel}</p>
			<p><span>Options</span> {periodLabel.join(', ')}</p>
		</div>
	</header>

	<main class="shell__main">
{@render children()}
	</main>
</div>
