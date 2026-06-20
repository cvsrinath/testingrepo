import { getAsset } from '$lib/mock/infrastructure';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const asset = getAsset(params.assetId);
	if (!asset) error(404, 'Asset not found');
	return { asset };
};
