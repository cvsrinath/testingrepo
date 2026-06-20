import { getAsset } from '$lib/mock/infrastructure';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params }) => {
	const asset = getAsset(params.assetId);
	if (!asset) error(404, 'Not found');
	return json(asset);
};
