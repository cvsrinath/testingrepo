import { getOnboardingDashboard } from '$lib/mock/onboarding';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { stats: getOnboardingDashboard() };
};
