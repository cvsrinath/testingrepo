import { getInfraDashboard } from '$lib/mock/infrastructure';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ stats: getInfraDashboard() });
