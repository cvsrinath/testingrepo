import { getTeamInfrastructure } from '$lib/mock/infrastructure';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => json(getTeamInfrastructure(params.teamId));
