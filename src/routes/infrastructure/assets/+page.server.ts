import { listAssets } from '$lib/mock/infrastructure';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const type = url.searchParams.get('type') ?? '';
	const environment = url.searchParams.get('environment') ?? '';
	const criticality = url.searchParams.get('criticality') ?? '';
	const ownerTeam = url.searchParams.get('ownerTeam') ?? '';
	const q = url.searchParams.get('q') ?? '';
	const assets = listAssets({ type: type || undefined, environment: environment || undefined, criticality: criticality || undefined, ownerTeam: ownerTeam || undefined, q: q || undefined });
	return { assets, filters: { type, environment, criticality, ownerTeam, q } };
};
