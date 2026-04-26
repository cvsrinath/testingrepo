import { fireEvent, render } from '@testing-library/svelte';
import { getTeamDetail } from '$lib/mock/kypData';
import { resetPeriod } from '$lib/stores/period';
import { afterEach, describe, expect, it } from 'vitest';
import TeamDetailPage from './+page.svelte';

describe('Team detail page', () => {
	afterEach(() => {
		resetPeriod();
	});

	it('shows member list when switching to members tab', async () => {
		const detail = getTeamDetail('team-alpha');
		if (!detail) {
			throw new Error('Expected team-alpha');
		}

		const { getByText, getByTestId } = render(TeamDetailPage, {
			data: { detail }
		});

		await fireEvent.click(getByText('Members'));
		expect(getByTestId('team-members-tab')).toBeInTheDocument();
		expect(getByText('Alex Rivera')).toBeInTheDocument();
		expect(getByTestId('team-members-head').textContent).toContain('Contribution Activity YTD');
	});

	it('updates the team view when the period changes', async () => {
		const detail = getTeamDetail('team-alpha');
		if (!detail) {
			throw new Error('Expected team-alpha');
		}

		const { getByLabelText, getByTestId, getByText } = render(TeamDetailPage, {
			data: { detail }
		});

		const periodSelect = getByLabelText('Review period') as HTMLSelectElement;
		await fireEvent.change(periodSelect, { target: { value: 'Q' } });

		expect(getByTestId('team-period-description').textContent).toContain('Quarter snapshot');
		expect(getByText('PR throughput (Q)')).toBeInTheDocument();
	});
});
