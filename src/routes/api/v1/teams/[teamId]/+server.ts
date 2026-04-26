import { json } from '@sveltejs/kit';
import { getTeamDetail } from '$lib/mock/kypData';

export function GET({ params }) {
	const detail = getTeamDetail(params.teamId);
	if (!detail) {
		return json({ message: 'Team not found' }, { status: 404 });
	}

	return json(detail);
}
