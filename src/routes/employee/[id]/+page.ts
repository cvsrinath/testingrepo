import { getEmployeeDetail } from '$lib/mock/kypData';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const employee = getEmployeeDetail(params.id);

	if (!employee) {
		throw error(404, 'Employee not found');
	}

	return { employee };
};
