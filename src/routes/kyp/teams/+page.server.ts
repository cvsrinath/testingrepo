import { getScoringConfig, listTeams, parseTeamFilters } from '$lib/mock/kypData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const filters = parseTeamFilters(url.searchParams);
	const result = listTeams(filters);

	return {
		filters,
		result,
		scoringConfig: getScoringConfig()
	};
};
