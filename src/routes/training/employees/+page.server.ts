import { listEmployeeProfiles } from '$lib/mock/training';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const team = url.searchParams.get('team') ?? '';
	const q = url.searchParams.get('q') ?? '';
	const employees = listEmployeeProfiles({ team: team || undefined, q: q || undefined });
	return { employees, filters: { team, q } };
};
