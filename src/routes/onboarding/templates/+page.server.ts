import { getOnboardingTemplates } from '$lib/mock/onboarding';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	return { templates: getOnboardingTemplates() };
};
