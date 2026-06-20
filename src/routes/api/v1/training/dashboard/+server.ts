import { json } from '@sveltejs/kit';
import { getTrainingDashboard } from '$lib/mock/training';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	return json(getTrainingDashboard());
};
