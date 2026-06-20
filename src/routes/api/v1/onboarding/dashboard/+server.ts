import { getOnboardingDashboard } from '$lib/mock/onboarding';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => json(getOnboardingDashboard());
