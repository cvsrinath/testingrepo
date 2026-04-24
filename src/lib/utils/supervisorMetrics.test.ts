import { teamRoster } from '$lib/mock/kypData';
import { describe, expect, it } from 'vitest';
import { applyPeriodMetrics, applyWeightPreset } from './supervisorMetrics';

describe('supervisor metrics transformations', () => {
	it('applies period multipliers to roster metrics', () => {
		const base = teamRoster[0];
		const adjusted = applyPeriodMetrics([base], 'Q')[0];
		expect(adjusted.commitsPerWeek).not.toBe(base.commitsPerWeek);
		expect(adjusted.prThroughput).not.toBe(base.prThroughput);
	});

	it('recomputes composite scores by selected weight preset', () => {
		const rows = applyPeriodMetrics(teamRoster.slice(0, 6), 'YTD');
		const icScores = applyWeightPreset(rows, 'IC Engineer');
		const managerScores = applyWeightPreset(rows, 'Engineering Manager');
		expect(icScores[0].compositeScore).not.toBe(managerScores[0].compositeScore);
	});
});
