<script lang="ts">
	import StatusBadge from '$lib/components/shared/StatusBadge.svelte';
	import ProgressBar from '$lib/components/shared/ProgressBar.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const profile = $derived(data.profile);
</script>

<section class="training-profile">
	<div class="breadcrumb">
		<a href="/training">Training</a>
		<span>›</span>
		<a href="/training/employees">Employees</a>
		<span>›</span>
		<span>{profile.person.name}</span>
	</div>

	<div class="panel info-card">
		<div>
			<p class="eyebrow">Training Profile</p>
			<h2>{profile.person.name}</h2>
			<p class="meta">{profile.person.role} · {profile.team.name}</p>
			<p class="meta">{profile.person.email}</p>
		</div>
		<div class="kpis">
			<div class="kpi"><span>Completion Rate</span><strong>{profile.completionRate}%</strong></div>
			<div class="kpi"><span>Overdue</span><strong class:danger={profile.overdueCount > 0}>{profile.overdueCount}</strong></div>
			<div class="kpi"><span>Certifications</span><strong>{profile.certifications.length}</strong></div>
		</div>
	</div>

	<div class="panel">
		<h3>Overall Progress</h3>
		<ProgressBar value={profile.completionRate} label="Completion" variant={profile.completionRate === 100 ? 'success' : profile.overdueCount > 0 ? 'warning' : 'default'} />
	</div>

	<section class="panel">
		<h3>Assigned Trainings</h3>
		<table class="training-table">
			<thead>
				<tr><th>Course</th><th>Category</th><th>Status</th><th>Due Date</th><th>Completed</th><th>Score</th></tr>
			</thead>
			<tbody>
				{#each profile.trainings as t}
					<tr>
						<td><a href="/training/catalog/{t.courseId}">{t.course.title}</a></td>
						<td>{t.course.category}</td>
						<td><StatusBadge status={t.status} /></td>
						<td>{t.dueDate ?? '—'}</td>
						<td>{t.completedDate ?? '—'}</td>
						<td>{t.score != null ? `${t.score}%` : '—'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	{#if profile.certifications.length > 0}
		<section class="panel">
			<h3>Certifications</h3>
			<table class="training-table">
				<thead>
					<tr><th>Name</th><th>Issuer</th><th>Earned</th><th>Expires</th><th>Status</th></tr>
				</thead>
				<tbody>
					{#each profile.certifications as cert}
						<tr>
							<td>{cert.name}</td>
							<td>{cert.issuer}</td>
							<td>{cert.earnedDate}</td>
							<td>{cert.expiryDate ?? 'No expiry'}</td>
							<td><StatusBadge status={cert.status} /></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/if}

	{#if profile.recommendedCourses.length > 0}
		<section class="panel">
			<h3>Recommended Courses</h3>
			<ul class="rec-list">
				{#each profile.recommendedCourses as course}
					<li>
						<a href="/training/catalog/{course.id}">{course.title}</a>
						<span class="meta">{course.duration} · {course.difficulty}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</section>

<style>
	.training-profile { display: grid; gap: 1rem; max-width: 80rem; }
	.breadcrumb { display: flex; gap: 0.4rem; align-items: center; font-size: 0.82rem; color: var(--muted); }
	.breadcrumb a { color: var(--accent); text-decoration: none; }
	.breadcrumb a:hover { text-decoration: underline; }
	.info-card { display: flex; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
	.eyebrow { margin: 0; font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); font-weight: 700; }
	h2 { margin: 0.2rem 0; }
	h3 { margin: 0 0 0.75rem; font-size: 1rem; }
	.meta { margin: 0.15rem 0 0; color: var(--muted); font-size: 0.88rem; }
	.kpis { display: flex; gap: 1.5rem; align-items: center; flex-shrink: 0; }
	.kpi { display: grid; gap: 0.1rem; }
	.kpi span { font-size: 0.76rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
	.kpi strong { font-size: 1.5rem; }
	.danger { color: var(--danger); }
	.training-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
	.training-table th, .training-table td { padding: 0.65rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; }
	.training-table th { font-size: 0.74rem; text-transform: uppercase; color: var(--muted); background: var(--surface-alt); }
	.training-table a { color: var(--accent); text-decoration: none; }
	.training-table a:hover { text-decoration: underline; }
	.rec-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
	.rec-list li { display: flex; gap: 0.75rem; align-items: center; font-size: 0.88rem; }
	.rec-list a { color: var(--accent); text-decoration: none; }
</style>
