import { listTeamsInfra } from '$lib/mock/infrastructure';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => ({ teams: listTeamsInfra() });
