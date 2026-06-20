<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="templates-page">
	<header>
		<h2>Team Onboarding Templates</h2>
		<p class="subtext">Standard task checklists for each team. Read-only — modify via admin tooling.</p>
	</header>

	<div class="templates-grid">
		{#each data.templates as tpl}
			<section class="panel template-card">
				<h3>{tpl.teamName}</h3>
				<p class="task-count">{tpl.tasks.length} tasks</p>
				<ul class="task-list">
					{#each tpl.tasks as task}
						<li class="task-item">
							<span class="task-cat">{task.category.replace('_', ' ')}</span>
							<span>{task.title}</span>
							{#if task.assignedTo}<span class="assigned">→ {task.assignedTo}</span>{/if}
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</section>

<style>
	.templates-page { display: grid; gap: 1.5rem; max-width: 80rem; }
	h2 { margin: 0; }
	h3 { margin: 0 0 0.25rem; }
	.subtext { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.88rem; }

	.templates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1rem;
		align-items: start;
	}

	.template-card { display: grid; gap: 0.75rem; }
	.task-count { margin: 0; font-size: 0.82rem; color: var(--muted); }

	.task-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.35rem; }
	.task-item { display: grid; gap: 0.1rem; padding: 0.5rem 0.65rem; background: var(--surface-alt); border-radius: 4px; font-size: 0.85rem; }
	.task-cat { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); font-weight: 700; }
	.assigned { font-size: 0.78rem; color: var(--muted); }
</style>
