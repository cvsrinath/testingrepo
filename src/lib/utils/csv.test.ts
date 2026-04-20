import { teamRoster } from '$lib/mock/kypData';
import { describe, expect, it } from 'vitest';
import { teamRowsToCsv } from './csv';

describe('teamRowsToCsv', () => {
	it('includes headers and visible rows', () => {
		const rows = teamRoster.slice(0, 2);
		const csv = teamRowsToCsv(rows);

		expect(csv).toContain(
			'Employee,Role,Composite,Commits/Wk,PR Throughput,Review Engagement,Impact,Code Quality'
		);
		expect(csv).toContain('Alex Rivera');
		expect(csv).toContain('Maria Owens');
	});
});
