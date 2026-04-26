import { render } from '@testing-library/svelte';
import { defaultTeamFilterState, getScoringConfig, listTeams } from '$lib/mock/kypData';
import { describe, expect, it } from 'vitest';
import TeamsPage from './+page.svelte';

describe('Teams page', () => {
	it('renders typeahead suggestions and matched teams', () => {
		const filters = { ...defaultTeamFilterState, q: 'alex' };
		const result = listTeams(filters);
		const { getByTestId, getByText } = render(TeamsPage, {
			data: {
				filters,
				result,
				scoringConfig: getScoringConfig()
			}
		});

		expect(getByTestId('team-typeahead')).toBeInTheDocument();
		expect(getByTestId('teams-table')).toBeInTheDocument();
		expect(getByText('Team Alpha')).toBeInTheDocument();
	});
});
