import { teamRoster } from '$lib/mock/kypData';
import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import TeamRosterTable from './TeamRosterTable.svelte';

describe('TeamRosterTable', () => {
	it('renders supervisor table rows and sort controls', async () => {
		const onSort = vi.fn();
		const { getByRole, getByTestId, getByText } = render(TeamRosterTable, {
			rows: teamRoster.slice(0, 2),
			sortKey: 'compositeScore',
			sortDirection: 'desc',
			onSort
		});

		expect(getByTestId('team-roster-table')).toBeInTheDocument();
		expect(getByText('Alex Rivera')).toBeInTheDocument();
		expect(getByText('Maria Owens')).toBeInTheDocument();
		expect(getByRole('link', { name: /Alex Rivera/i })).toHaveAttribute('href', '/employee/alex-rivera');

		await fireEvent.click(getByText(/Composite/));
		expect(onSort).toHaveBeenCalled();
	});
});
