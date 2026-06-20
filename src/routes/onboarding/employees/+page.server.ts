import { listOnboardingEmployees } from '$lib/mock/onboarding';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const status = url.searchParams.get('status') ?? '';
	const team = url.searchParams.get('team') ?? '';
	const q = url.searchParams.get('q') ?? '';
	const employees = listOnboardingEmployees({ status: status || undefined, team: team || undefined, q: q || undefined });
	return { employees, filters: { status, team, q } };
};
