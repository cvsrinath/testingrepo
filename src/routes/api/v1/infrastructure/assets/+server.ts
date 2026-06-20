import { listAssets } from '$lib/mock/infrastructure';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const type = url.searchParams.get('type') ?? undefined;
	const environment = url.searchParams.get('environment') ?? undefined;
	const criticality = url.searchParams.get('criticality') ?? undefined;
	const ownerTeam = url.searchParams.get('ownerTeam') ?? undefined;
	const q = url.searchParams.get('q') ?? undefined;
	return json(listAssets({ type, environment, criticality, ownerTeam, q }));
};
