import { json } from '@sveltejs/kit';
import { listTeams, parseTeamFilters } from '$lib/mock/kypData';

export function GET({ url }) {
	return json(listTeams(parseTeamFilters(url.searchParams)));
}
