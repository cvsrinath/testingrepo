import { teamRoster } from '$lib/mock/kypData';
import { describe, expect, it } from 'vitest';
import { sortTeamMembers } from './sorting';

describe('sortTeamMembers', () => {
	it('sorts ascending by metric', () => {
		const sorted = sortTeamMembers(teamRoster.slice(0, 3), 'compositeScore', 'asc');
		expect(sorted[0].compositeScore).toBeLessThanOrEqual(sorted[1].compositeScore);
	});

	it('sorts descending by metric', () => {
		const sorted = sortTeamMembers(teamRoster.slice(0, 3), 'commitsPerWeek', 'desc');
		expect(sorted[0].commitsPerWeek).toBeGreaterThanOrEqual(sorted[1].commitsPerWeek);
	});
});
