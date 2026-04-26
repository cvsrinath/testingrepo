import {
	defaultTeamFilterState,
	getDefaultScoringConfig,
	getScoringConfig,
	getTeamDetail,
	listTeams,
	updateScoringConfig,
	validateScoringConfig
} from './kypData';
import { afterEach, describe, expect, it } from 'vitest';

const baseline = getScoringConfig();

describe('kyp mock data team queries', () => {
	afterEach(() => {
		updateScoringConfig(baseline);
	});

	it('filters teams by member search and region', () => {
		const result = listTeams({
			...defaultTeamFilterState,
			q: 'alex',
			region: 'NA'
		});

		expect(result.total).toBe(1);
		expect(result.items[0]?.teamId).toBe('team-alpha');
	});

	it('recalculates team score when a source is disabled', () => {
		const before = getTeamDetail('team-alpha');
		if (!before) {
			throw new Error('Expected team-alpha');
		}

		updateScoringConfig({
			sources: {
				...baseline.sources,
				github: { ...baseline.sources.github, enabled: false }
			}
		});

		const after = getTeamDetail('team-alpha');
		if (!after) {
			throw new Error('Expected team-alpha');
		}

		expect(after.aggregatedScore).not.toBe(before.aggregatedScore);
	});

	it('validates admin scoring config totals and enabled sources', () => {
		const validation = validateScoringConfig({
			...getDefaultScoringConfig(),
			sources: {
				bitbucket: { enabled: false, label: 'Bitbucket' },
				github: { enabled: false, label: 'GitHub' },
				jenkins: { enabled: false, label: 'Jenkins' },
				productionDefects: { enabled: false, label: 'Production Defects' },
				hotfixes: { enabled: false, label: 'Hotfixes' },
				gcp: { enabled: false, label: 'GCP' },
				sonar: { enabled: false, label: 'Sonar' }
			},
			weights: {
				codeQuality: 10,
				prActivity: 10,
				deployments: 10,
				defectsMttr: 10,
				hotfixes: 10,
				gcp: 10
			}
		});

		expect(validation.isValid).toBe(false);
		expect(validation.errors).toContain('Enable at least one data source.');
		expect(validation.errors).toContain('Weights must add up to exactly 100.');
	});
});
