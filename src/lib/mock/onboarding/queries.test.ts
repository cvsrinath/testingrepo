import { describe, it, expect } from 'vitest';
import { getOnboardingDashboard, listOnboardingEmployees, getOnboardingEmployee } from './queries';

describe('getOnboardingDashboard', () => {
	it('returns dashboard stats', () => {
		const stats = getOnboardingDashboard();
		expect(typeof stats.newHiresThisMonth).toBe('number');
		expect(typeof stats.activeOnboardings).toBe('number');
		expect(typeof stats.averageCompletionPercent).toBe('number');
		expect(Array.isArray(stats.upcomingStartDates)).toBe(true);
		expect(Array.isArray(stats.delayedTasks)).toBe(true);
	});

	it('completion percent is 0-100', () => {
		const { averageCompletionPercent } = getOnboardingDashboard();
		expect(averageCompletionPercent).toBeGreaterThanOrEqual(0);
		expect(averageCompletionPercent).toBeLessThanOrEqual(100);
	});
});

describe('listOnboardingEmployees', () => {
	it('returns all employees without filters', () => {
		const all = listOnboardingEmployees();
		expect(all.length).toBeGreaterThan(0);
	});

	it('filters by status', () => {
		const inProgress = listOnboardingEmployees({ status: 'in_progress' });
		expect(inProgress.every((e) => e.status === 'in_progress')).toBe(true);
	});

	it('filters by name query', () => {
		const all = listOnboardingEmployees();
		const firstName = all[0].person.name.split(' ')[0].toLowerCase();
		const filtered = listOnboardingEmployees({ q: firstName });
		expect(filtered.length).toBeGreaterThan(0);
	});
});

describe('getOnboardingEmployee', () => {
	it('returns undefined for unknown id', () => {
		expect(getOnboardingEmployee('nonexistent')).toBeUndefined();
	});

	it('returns employee for known id', () => {
		const all = listOnboardingEmployees();
		const first = all[0];
		const found = getOnboardingEmployee(first.person.id);
		expect(found?.person.id).toBe(first.person.id);
	});
});
