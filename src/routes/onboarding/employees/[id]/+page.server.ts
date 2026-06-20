import { getOnboardingEmployee } from '$lib/mock/onboarding';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const employee = getOnboardingEmployee(params.id);
	if (!employee) error(404, 'Employee not found');
	return { employee };
};
