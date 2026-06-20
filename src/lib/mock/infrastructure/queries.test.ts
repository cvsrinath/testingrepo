import { describe, it, expect } from 'vitest';
import { getInfraDashboard, listAssets, getAsset, getTeamInfrastructure } from './queries';

describe('getInfraDashboard', () => {
	it('returns dashboard stats', () => {
		const stats = getInfraDashboard();
		expect(stats.totalAssets).toBeGreaterThan(0);
		expect(Array.isArray(stats.byType)).toBe(true);
		expect(Array.isArray(stats.byEnvironment)).toBe(true);
		expect(Array.isArray(stats.criticalSystems)).toBe(true);
	});

	it('byType counts sum to totalAssets', () => {
		const stats = getInfraDashboard();
		const sum = stats.byType.reduce((s, b) => s + b.count, 0);
		expect(sum).toBe(stats.totalAssets);
	});
});

describe('listAssets', () => {
	it('returns all assets without filters', () => {
		const all = listAssets();
		expect(all.length).toBeGreaterThan(0);
	});

	it('filters by type', () => {
		const repos = listAssets({ type: 'repository' });
		expect(repos.every((a) => a.type === 'repository')).toBe(true);
	});

	it('filters by environment', () => {
		const prod = listAssets({ environment: 'production' });
		expect(prod.every((a) => a.environment === 'production')).toBe(true);
	});
});

describe('getAsset', () => {
	it('returns undefined for unknown id', () => {
		expect(getAsset('nonexistent')).toBeUndefined();
	});

	it('returns asset for known id', () => {
		const all = listAssets();
		const first = all[0];
		const found = getAsset(first.id);
		expect(found?.id).toBe(first.id);
	});
});

describe('getTeamInfrastructure', () => {
	it('returns structure for a team', () => {
		const ti = getTeamInfrastructure('team-alpha');
		expect(ti.team.id).toBe('team-alpha');
		expect(Array.isArray(ti.ownedAssets)).toBe(true);
		expect(Array.isArray(ti.consumedAssets)).toBe(true);
	});
});
