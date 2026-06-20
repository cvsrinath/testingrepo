<script lang="ts">
	import { goto } from '$app/navigation';
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let filters = $state({ category: '', difficulty: '', required: '', q: '' });
	$effect(() => { filters = { ...data.filters }; });

	function apply() {
		const p = new URLSearchParams();
		if (filters.category) p.set('category', filters.category);
		if (filters.difficulty) p.set('difficulty', filters.difficulty);
		if (filters.required) p.set('required', filters.required);
		if (filters.q) p.set('q', filters.q);
		goto(`/training/catalog?${p.toString()}`);
	}
	function reset() { filters = { category: '', difficulty: '', required: '', q: '' }; goto('/training/catalog'); }
</script>

<section class="catalog-page">
	<header>
		<h2>Training Catalog</h2>
		<p class="subtext">{data.courses.length} course{data.courses.length !== 1 ? 's' : ''}</p>
	</header>

	<div class="panel filters">
		<label>Search<input bind:value={filters.q} placeholder="Title or tag..." oninput={apply} /></label>
		<label>Category
			<select bind:value={filters.category} onchange={apply}>
				<option value="">All</option>
				{#each ['security','compliance','technical','leadership','onboarding','certification'] as c}
					<option value={c}>{c}</option>
				{/each}
			</select>
		</label>
		<label>Difficulty
			<select bind:value={filters.difficulty} onchange={apply}>
				<option value="">All</option>
				<option value="beginner">Beginner</option>
				<option value="intermediate">Intermediate</option>
				<option value="advanced">Advanced</option>
			</select>
		</label>
		<label>Required
			<select bind:value={filters.required} onchange={apply}>
				<option value="">All</option>
				<option value="true">Required only</option>
				<option value="false">Optional only</option>
			</select>
		</label>
		<button class="button" type="button" onclick={reset}>Reset</button>
	</div>

	<div class="panel">
		<table class="catalog-table">
			<thead>
				<tr><th>Title</th><th>Category</th><th>Duration</th><th>Difficulty</th><th>Required</th><th>Provider</th></tr>
			</thead>
			<tbody>
				{#if data.courses.length === 0}
					<tr><td colspan="6" class="empty">No courses matched.</td></tr>
				{:else}
					{#each data.courses as course}
						<tr class="clickable" onclick={() => goto(`/training/catalog/${course.id}`)}>
							<td><a href="/training/catalog/{course.id}" class="course-link">{course.title}</a></td>
							<td><StatusBadge status={course.category} variant="neutral" /></td>
							<td>{course.duration}</td>
							<td>{course.difficulty}</td>
							<td>{#if course.required}<StatusBadge status="required" variant="info" />{:else}<span class="optional">Optional</span>{/if}</td>
							<td>{course.provider}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</section>

<style>
	.catalog-page { display: grid; gap: 1rem; max-width: 90rem; }
	h2 { margin: 0; }
	.subtext { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.88rem; }
	.filters { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: flex-end; }
	label { display: grid; gap: 0.3rem; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); }
	input, select { border: 1px solid var(--border); border-radius: 999px; padding: 0.55rem 0.85rem; font: inherit; font-size: 0.85rem; background: var(--surface); }
	.catalog-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.catalog-table th, .catalog-table td { padding: 0.7rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; }
	.catalog-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); background: var(--surface-alt); }
	tr.clickable { cursor: pointer; }
	tr.clickable:hover td { background: var(--surface-muted); }
	.course-link { font-weight: 600; text-decoration: none; color: var(--ink); }
	.course-link:hover { color: var(--accent); }
	.optional { color: var(--muted); font-size: 0.78rem; }
	.empty { text-align: center; color: var(--muted); padding: 2rem; }
</style>
