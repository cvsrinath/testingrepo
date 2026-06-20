import { describe, it, expect } from 'vitest';
import { getTrainingDashboard, listCourses, getCourse, listEmployeeProfiles, getEmployeeTrainingProfile, getManagerView } from './queries';

describe('getTrainingDashboard', () => {
	it('returns dashboard stats', () => {
		const stats = getTrainingDashboard();
		expect(stats.totalCourses).toBeGreaterThan(0);
		expect(stats.overallCompletionRate).toBeGreaterThanOrEqual(0);
		expect(stats.overallCompletionRate).toBeLessThanOrEqual(100);
		expect(Array.isArray(stats.completionByTeam)).toBe(true);
		expect(Array.isArray(stats.completionByCategory)).toBe(true);
	});
});

describe('listCourses', () => {
	it('returns all courses without filters', () => {
		const all = listCourses();
		expect(all.length).toBeGreaterThan(0);
	});

	it('filters by category', () => {
		const security = listCourses({ category: 'security' });
		expect(security.every((c) => c.category === 'security')).toBe(true);
	});

	it('filters by title query', () => {
		const all = listCourses();
		const word = all[0].title.split(' ')[0].toLowerCase();
		const filtered = listCourses({ q: word });
		expect(filtered.length).toBeGreaterThan(0);
	});
});

describe('getCourse', () => {
	it('returns undefined for unknown id', () => {
		expect(getCourse('nonexistent')).toBeUndefined();
	});

	it('returns course for known id', () => {
		const all = listCourses();
		const found = getCourse(all[0].id);
		expect(found?.id).toBe(all[0].id);
	});
});

describe('listEmployeeProfiles', () => {
	it('returns all profiles without filters', () => {
		const all = listEmployeeProfiles();
		expect(all.length).toBeGreaterThan(0);
	});

	it('filters by team', () => {
		const alpha = listEmployeeProfiles({ team: 'team-alpha' });
		expect(alpha.every((p) => p.team.id === 'team-alpha')).toBe(true);
	});
});

describe('getEmployeeTrainingProfile', () => {
	it('returns undefined for unknown id', () => {
		expect(getEmployeeTrainingProfile('nonexistent')).toBeUndefined();
	});

	it('returns profile for known id', () => {
		const all = listEmployeeProfiles();
		const found = getEmployeeTrainingProfile(all[0].person.id);
		expect(found?.person.id).toBe(all[0].person.id);
	});
});

describe('getManagerView', () => {
	it('returns team view with members', () => {
		const view = getManagerView('team-alpha');
		expect(view.team.id).toBe('team-alpha');
		expect(view.members.length).toBeGreaterThan(0);
		expect(view.teamCompletionRate).toBeGreaterThanOrEqual(0);
	});
});
