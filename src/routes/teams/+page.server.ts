import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const qs = url.search;
	redirect(307, `/kyp/teams${qs}`);
};
