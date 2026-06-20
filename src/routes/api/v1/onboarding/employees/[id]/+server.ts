import { getOnboardingEmployee } from '$lib/mock/onboarding';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
	const employee = getOnboardingEmployee(params.id);
	if (!employee) error(404, 'Not found');
	return json(employee);
};
