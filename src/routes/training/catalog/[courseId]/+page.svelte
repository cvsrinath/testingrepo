<script lang="ts">
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const course = $derived(data.course);
</script>

<section class="course-detail">
	<div class="breadcrumb">
		<a href="/training">Training</a>
		<span>›</span>
		<a href="/training/catalog">Catalog</a>
		<span>›</span>
		<span>{course.title}</span>
	</div>

	<div class="panel info-card">
		<div>
			<div class="badges">
				<StatusBadge status={course.category} variant="neutral" />
				{#if course.required}<StatusBadge status="required" variant="info" />{/if}
			</div>
			<h2>{course.title}</h2>
			<p class="desc">{course.description}</p>
		</div>
		<div class="meta-list">
			<div><span>Duration</span><strong>{course.duration}</strong></div>
			<div><span>Difficulty</span><strong>{course.difficulty}</strong></div>
			<div><span>Provider</span><strong>{course.provider}</strong></div>
		</div>
	</div>

	<div class="stats-row">
		<div class="panel stat-card"><span>Assigned</span><strong>{data.stats.assigned}</strong></div>
		<div class="panel stat-card"><span>Completed</span><strong>{data.stats.completed}</strong></div>
		<div class="panel stat-card"><span>In Progress</span><strong>{data.stats.inProgress}</strong></div>
	</div>

	{#if course.tags.length > 0}
		<div class="panel">
			<h3>Tags</h3>
			<div class="tags">
				{#each course.tags as tag}<span class="tag">{tag}</span>{/each}
			</div>
		</div>
	{/if}

	{#if course.recommendedFor.roles.length > 0 || course.recommendedFor.teams.length > 0}
		<div class="panel">
			<h3>Recommended For</h3>
			{#if course.recommendedFor.roles.length > 0}<p><strong>Roles:</strong> {course.recommendedFor.roles.join(', ')}</p>{/if}
			{#if course.recommendedFor.teams.length > 0}<p><strong>Teams:</strong> {course.recommendedFor.teams.join(', ')}</p>{/if}
			{#if course.recommendedFor.tracks.length > 0}<p><strong>Tracks:</strong> {course.recommendedFor.tracks.join(', ')}</p>{/if}
		</div>
	{/if}
</section>

<style>
	.course-detail { display: grid; gap: 1rem; max-width: 64rem; }
	.breadcrumb { display: flex; gap: 0.4rem; align-items: center; font-size: 0.82rem; color: var(--muted); }
	.breadcrumb a { color: var(--accent); text-decoration: none; }
	.breadcrumb a:hover { text-decoration: underline; }
	.info-card { display: flex; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
	.badges { display: flex; gap: 0.4rem; margin-bottom: 0.5rem; }
	h2 { margin: 0 0 0.5rem; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }
	.desc { margin: 0; color: var(--muted); font-size: 0.9rem; }
	.meta-list { display: grid; gap: 0.5rem; align-content: start; flex-shrink: 0; }
	.meta-list div { display: grid; gap: 0.1rem; }
	.meta-list span { font-size: 0.76rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
	.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
	.stat-card { display: grid; gap: 0.25rem; }
	.stat-card span { font-size: 0.78rem; color: var(--muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
	.stat-card strong { font-size: 2rem; }
	.tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
	.tag { background: var(--surface-muted); border-radius: 4px; padding: 0.2rem 0.5rem; font-size: 0.75rem; color: var(--muted); }
	.panel p { margin: 0 0 0.4rem; font-size: 0.88rem; }
</style>
