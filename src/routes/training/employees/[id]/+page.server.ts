import { getEmployeeTrainingProfile } from '$lib/mock/training';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const profile = getEmployeeTrainingProfile(params.id);
	if (!profile) error(404, 'Profile not found');
	return { profile };
};
