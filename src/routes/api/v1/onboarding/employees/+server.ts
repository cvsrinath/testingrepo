import { listOnboardingEmployees } from '$lib/mock/onboarding';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const status = url.searchParams.get('status') ?? undefined;
	const team = url.searchParams.get('team') ?? undefined;
	const q = url.searchParams.get('q') ?? undefined;
	return json(listOnboardingEmployees({ status, team, q }));
};
