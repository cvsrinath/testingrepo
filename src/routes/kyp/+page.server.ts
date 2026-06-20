import { listTeams, getAllEmployeeListItems } from '$lib/mock/kypData';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const teamsResult = listTeams({ q: '', region: '', sizeBucket: '', active: '', stack: '', scoreMin: '', sort: 'score_desc', page: 1, pageSize: 1000 });
	const employees = getAllEmployeeListItems();

	return {
		totalTeams: teamsResult.total,
		totalEmployees: employees.length,
	};
};
