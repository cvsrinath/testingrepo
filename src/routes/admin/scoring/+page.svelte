<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const config = $derived(form?.config ?? data.config);
	const validation = $derived(form?.validation ?? data.validation);
	const preview = $derived(form?.preview ?? data.preview);
	const message = $derived(form?.message ?? '');
</script>

<section class="admin-page">
	<div class="session-notice" role="note">
		Changes apply to this browser session only and reset on page reload — no backend persistence exists in this prototype.
	</div>

	<header class="panel">
		<p class="eyebrow">Admin</p>
		<h2>Scoring Configuration</h2>
		<p class="subtext">Enable or disable data sources and tune how much each signal family contributes to the team score.</p>
	</header>

	<form class="panel config-form" method="POST" use:enhance>
		<section class="config-summary">
			<div class="summary-card">
				<span>Active sources</span>
				<strong>{validation.enabledSourceCount}</strong>
			</div>
			<div class="summary-card">
				<span>Total weight</span>
				<strong>{validation.totalWeight}</strong>
			</div>
			<div class="summary-card">
				<span>Status</span>
				<strong>{validation.isValid ? 'Ready to save' : 'Needs attention'}</strong>
			</div>
		</section>

		{#if !validation.isValid}
			<div class="validation-block" data-testid="config-validation-errors">
				<h3>Validation</h3>
				<ul>
					{#each validation.errors as error}
						<li>{error}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<section>
			<h3>Sources</h3>
			<div class="toggle-grid">
				{#each Object.entries(config.sources) as [key, source]}
					<label class="toggle">
						<input type="checkbox" name={`source-${key}`} checked={source.enabled} />
						<span>{source.label}</span>
					</label>
				{/each}
			</div>
		</section>

		<section>
			<h3>Weights</h3>
			<div class="weights-grid">
				<label>
					Code quality
					<input type="number" min="0" max="100" step="1" name="weight-codeQuality" value={config.weights.codeQuality} />
				</label>
				<label>
					PR activity
					<input type="number" min="0" max="100" step="1" name="weight-prActivity" value={config.weights.prActivity} />
				</label>
				<label>
					Deployments
					<input type="number" min="0" max="100" step="1" name="weight-deployments" value={config.weights.deployments} />
				</label>
				<label>
					Defects + MTTR
					<input type="number" min="0" max="100" step="1" name="weight-defectsMttr" value={config.weights.defectsMttr} />
				</label>
				<label>
					Hotfixes
					<input type="number" min="0" max="100" step="1" name="weight-hotfixes" value={config.weights.hotfixes} />
				</label>
				<label>
					GCP
					<input type="number" min="0" max="100" step="1" name="weight-gcp" value={config.weights.gcp} />
				</label>
			</div>
			<p class="weight-total">Total weight: <strong>{validation.totalWeight}</strong></p>
		</section>

		<section class="config-meta">
			<p><strong>Missing data policy:</strong> {config.normalization.missingDataPolicy}</p>
			<p><strong>Winsorize percentile:</strong> {config.normalization.winsorizePercentile}</p>
			<p><strong>Last updated:</strong> {new Date(config.updatedAt).toLocaleString()}</p>
		</section>

		<section>
			<h3>Preview</h3>
			<div class="preview-table">
				<table data-testid="admin-preview-table">
					<thead>
						<tr>
							<th>Team</th>
							<th>Region</th>
							<th>Score</th>
							<th>Source Health</th>
						</tr>
					</thead>
					<tbody>
						{#each preview as team}
							<tr>
								<td>{team.name}</td>
								<td>{team.region}</td>
								<td>{team.aggregatedScore}</td>
								<td>{team.sourceHealth}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<div class="actions">
			<button class="button button--primary" type="submit" name="intent" value="save">Save configuration</button>
			<button class="button" type="submit" name="intent" value="reset">Reset defaults</button>
			<a class="button" href="/teams">Back to teams</a>
		</div>

		{#if message}
			<p class:save-note={form?.success} class:warning-note={form && !form.success} data-testid="config-status-note">
				{message}
			</p>
		{/if}
	</form>
</section>

<style>
	.admin-page {
		display: grid;
		gap: 1rem;
		max-width: 70rem;
	}

	.session-notice {
		padding: 0.6rem 0.85rem;
		border: 1px solid var(--border);
		border-left: 4px solid var(--warning, #d97706);
		border-radius: 4px;
		background: var(--surface-alt);
		font-size: 0.84rem;
		color: var(--muted);
	}

	.eyebrow {
		margin: 0;
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		font-weight: 700;
	}

	h2,
	h3,
	.subtext,
	.weight-total,
	.config-meta p,
	.save-note,
	.warning-note {
		margin: 0;
	}

	.subtext,
	.config-meta {
		color: var(--muted);
	}

	.config-form,
	.toggle-grid,
	.weights-grid {
		display: grid;
		gap: 1rem;
	}

	.config-summary {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
		gap: 0.75rem;
	}

	.summary-card,
	.validation-block {
		padding: 0.85rem 1rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--surface-alt);
	}

	.summary-card span {
		display: block;
		font-size: 0.8rem;
		color: var(--muted);
		margin-bottom: 0.3rem;
	}

	.summary-card strong {
		font-size: 1.25rem;
	}

	.validation-block {
		border-left: 4px solid var(--warning);
	}

	.validation-block ul {
		margin: 0.6rem 0 0;
		padding-left: 1rem;
	}

	.toggle-grid,
	.weights-grid {
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	}

	.toggle {
		display: flex;
		gap: 0.55rem;
		align-items: center;
		padding: 0.75rem 0.85rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--surface-alt);
	}

	label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.84rem;
		font-weight: 700;
		color: var(--muted);
	}

	input[type='number'] {
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.55rem 0.8rem;
		font: inherit;
	}

	.preview-table {
		overflow: auto;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		min-width: 32rem;
	}

	th,
	td {
		padding: 0.75rem 0.7rem;
		border-bottom: 1px solid var(--border);
		text-align: left;
	}

	th {
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
		background: var(--surface-alt);
	}

	.actions {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.save-note {
		color: var(--accent);
		font-weight: 700;
	}

	.warning-note {
		color: var(--warning);
		font-weight: 700;
	}
</style>
