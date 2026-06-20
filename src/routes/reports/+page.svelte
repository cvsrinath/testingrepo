<section class="reports-landing">
	<header>
		<h2>Stakeholder Reports</h2>
		<p class="subtext">Cross-module dashboards and executive summaries.</p>
	</header>

	<div class="cards">
		<a href="/reports/quarterly" class="panel card">
			<span class="icon">📊</span>
			<div>
				<h3>Quarterly Report</h3>
				<p>Team performance, training completion, and onboarding stats by quarter.</p>
			</div>
		</a>
		<a href="/reports/teams" class="panel card">
			<span class="icon">👥</span>
			<div>
				<h3>By Team</h3>
				<p>Drill into a specific team's KYP scores, onboarding progress, and infrastructure health.</p>
			</div>
		</a>
	</div>

	<div class="panel placeholder">
		<p class="coming-soon">Full report generation is coming soon. Reports will aggregate data across KYP, Onboarding, Infrastructure, and Training modules.</p>
	</div>
</section>

<style>
	.reports-landing { display: grid; gap: 1.5rem; max-width: 60rem; }
	header h2 { margin: 0; }
	.subtext { margin: 0.25rem 0 0; color: var(--muted); font-size: 0.9rem; }
	.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
	.card { display: flex; gap: 1rem; align-items: flex-start; text-decoration: none; color: inherit; transition: box-shadow 0.15s; }
	.card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
	.icon { font-size: 2rem; flex-shrink: 0; }
	h3 { margin: 0 0 0.3rem; font-size: 1rem; }
	p { margin: 0; font-size: 0.87rem; color: var(--muted); }
	.placeholder { background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px); }
	.coming-soon { color: var(--muted); font-style: italic; font-size: 0.9rem; margin: 0; }
</style>
