<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<section class="kyp-landing">
	<header>
		<p class="eyebrow">Module</p>
		<h2>Know Your Performance</h2>
		<p class="subtext">Team and employee performance metrics powered by mock data across delivery and quality signals.</p>
	</header>

	<div class="kpi-row">
		<div class="panel kpi-card">
			<span class="kpi-label">Total Teams</span>
			<strong class="kpi-value">{data.totalTeams}</strong>
		</div>
		<div class="panel kpi-card">
			<span class="kpi-label">Total Employees</span>
			<strong class="kpi-value">{data.totalEmployees}</strong>
		</div>
	</div>

	<div class="quick-links">
		<a class="panel quick-link" href="/kyp/teams">
			<span class="quick-link__icon">👥</span>
			<div>
				<strong>Teams</strong>
				<p>Browse all teams, filter by region, size, and stack.</p>
			</div>
		</a>
		<a class="panel quick-link" href="/kyp/supervisor">
			<span class="quick-link__icon">📋</span>
			<div>
				<strong>Supervisor Dashboard</strong>
				<p>Team roster, cohort distributions, and metric weights.</p>
			</div>
		</a>
		<a class="panel quick-link" href="/kyp/admin/scoring">
			<span class="quick-link__icon">⚙️</span>
			<div>
				<strong>Scoring Admin</strong>
				<p>Configure scoring sources, weights, and normalization.</p>
			</div>
		</a>
	</div>
</section>

<style>
	.kyp-landing {
		display: grid;
		gap: 1.5rem;
		max-width: 64rem;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		font-weight: 700;
	}

	h2 {
		margin: 0.25rem 0 0.5rem;
		font-size: 1.75rem;
	}

	.subtext {
		margin: 0;
		color: var(--muted);
		max-width: 42rem;
	}

	.kpi-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 0.75rem;
	}

	.kpi-card {
		display: grid;
		gap: 0.3rem;
	}

	.kpi-label {
		font-size: 0.8rem;
		color: var(--muted);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.kpi-value {
		font-size: 2rem;
		line-height: 1;
		color: var(--ink);
	}

	.quick-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 0.75rem;
	}

	.quick-link {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.quick-link:hover {
		border-color: var(--accent);
		box-shadow: 0 0 0 3px var(--accent-soft);
	}

	.quick-link__icon {
		font-size: 1.5rem;
		line-height: 1;
		margin-top: 2px;
	}

	.quick-link strong {
		display: block;
		margin-bottom: 0.25rem;
	}

	.quick-link p {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted);
	}
</style>
