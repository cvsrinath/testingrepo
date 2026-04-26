import { getTeamDetail } from '$lib/mock/kypData';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const detail = getTeamDetail(params.teamId);
	if (!detail) {
		throw error(404, 'Team not found');
	}

	return {
		detail
	};
};
