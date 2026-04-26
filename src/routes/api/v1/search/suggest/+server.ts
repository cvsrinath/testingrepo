import { json } from '@sveltejs/kit';
import { getTeamSearchTypeahead } from '$lib/mock/kypData';

export function GET({ url }) {
	const q = url.searchParams.get('q') ?? '';
	return json({ items: getTeamSearchTypeahead(q) });
}
