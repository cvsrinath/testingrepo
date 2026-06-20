import { getTeamInfrastructure } from '$lib/mock/infrastructure';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => ({ infra: getTeamInfrastructure(params.teamId) });
