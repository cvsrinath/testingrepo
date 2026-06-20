import { json, error } from '@sveltejs/kit';
import { getEmployeeTrainingProfile } from '$lib/mock/training';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
	const profile = getEmployeeTrainingProfile(params.id);
	if (!profile) error(404, 'Profile not found');
	return json(profile);
};
