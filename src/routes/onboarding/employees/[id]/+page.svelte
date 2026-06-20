<script lang="ts">
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import ProgressBar from '$lib/components/shared/ProgressBar.svelte';
	import type { TaskCategory } from '$lib/types/onboarding';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const categoryOrder: TaskCategory[] = ['hardware', 'accounts', 'access', 'hr', 'orientation', 'team_specific'];

	const tasksByCategory = $derived(
		categoryOrder.map((cat) => ({
			category: cat,
			label: cat.replace('_', ' '),
			tasks: [...data.employee.tasks, ...data.employee.teamSpecificTasks].filter((t) => t.category === cat),
		})).filter((g) => g.tasks.length > 0)
	);

	const progressVariant = $derived(
		data.employee.completionPercent === 100 ? 'success' :
		data.employee.status === 'blocked' ? 'danger' : 'default'
	);
</script>

<section class="detail-page">
	<div class="breadcrumb">
		<a href="/onboarding">Onboarding</a>
		<span>›</span>
		<a href="/onboarding/employees">Employees</a>
		<span>›</span>
		<span>{data.employee.person.name}</span>
	</div>

	<div class="info-card panel">
		<div class="info-card__main">
			<p class="eyebrow">Onboarding Employee</p>
			<h2>{data.employee.person.name}</h2>
			<p class="meta">{data.employee.person.role} · {data.employee.team.name} · {data.employee.location}</p>
			<p class="meta">{data.employee.person.email}</p>
		</div>
		<div class="info-card__stats">
			<div><span>Start Date</span><strong>{data.employee.startDate}</strong></div>
			<div><span>Manager</span><strong>{data.employee.manager.name}</strong></div>
			<div><span>Employment</span><strong>{data.employee.employmentType.replace('_', ' ')}</strong></div>
			<div><span>Status</span><StatusBadge status={data.employee.status} /></div>
		</div>
	</div>

	<div class="panel progress-section">
		<h3>Overall Progress</h3>
		<ProgressBar value={data.employee.completionPercent} label="Completion" variant={progressVariant} />
	</div>

	{#each tasksByCategory as group}
		<section class="panel task-group">
			<h3 class="task-group__title">{group.label}</h3>
			<ul class="task-list">
				{#each group.tasks as task}
					<li class="task-item">
						<div class="task-item__info">
							<span class="task-item__title">{task.title}</span>
							{#if task.assignedTo}<span class="task-item__meta">Assigned to: {task.assignedTo}</span>{/if}
							{#if task.dueDate}<span class="task-item__meta">Due: {task.dueDate}</span>{/if}
							{#if task.blockedReason}<span class="task-item__blocked">⚠ {task.blockedReason}</span>{/if}
						</div>
						<StatusBadge status={task.status} />
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</section>

<style>
	.detail-page { display: grid; gap: 1rem; max-width: 64rem; }

	.breadcrumb {
		display: flex; gap: 0.4rem; align-items: center;
		font-size: 0.82rem; color: var(--muted);
	}
	.breadcrumb a { color: var(--accent); text-decoration: none; }
	.breadcrumb a:hover { text-decoration: underline; }

	.info-card { display: flex; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
	.eyebrow { margin: 0; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 700; }
	h2 { margin: 0.2rem 0; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }
	.meta { margin: 0.15rem 0 0; color: var(--muted); font-size: 0.88rem; }

	.info-card__stats { display: grid; gap: 0.5rem; align-content: start; }
	.info-card__stats div { display: grid; gap: 0.1rem; }
	.info-card__stats span { font-size: 0.76rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
	.info-card__stats strong { font-size: 0.9rem; }

	.progress-section { display: grid; gap: 0.5rem; }

	.task-group__title { text-transform: capitalize; }
	.task-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
	.task-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: 0.65rem 0.85rem; background: var(--surface-alt); border: 1px solid var(--border); border-radius: var(--radius); }
	.task-item__info { display: grid; gap: 0.15rem; }
	.task-item__title { font-size: 0.9rem; font-weight: 500; }
	.task-item__meta { font-size: 0.78rem; color: var(--muted); }
	.task-item__blocked { font-size: 0.78rem; color: var(--danger); }
</style>
