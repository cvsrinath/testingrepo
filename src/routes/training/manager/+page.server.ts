import { getManagerView } from '$lib/mock/training';
import { teams } from '$lib/mock/shared/employees';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const teamId = url.searchParams.get('team') ?? 'team-alpha';
	return { view: getManagerView(teamId), teams, selectedTeam: teamId };
};
