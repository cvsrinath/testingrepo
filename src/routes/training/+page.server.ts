import { getTrainingDashboard } from '$lib/mock/training';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ stats: getTrainingDashboard() });
