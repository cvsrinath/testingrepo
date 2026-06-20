import { listTeams, getAllEmployeeListItems } from '$lib/mock/kypData';
import { getOnboardingDashboard } from '$lib/mock/onboarding';
import { getInfraDashboard } from '$lib/mock/infrastructure';
import { getTrainingDashboard } from '$lib/mock/training';
import type { PageServerLoad } from './$types';

const defaultFilters = {
	q: '',
	region: '',
	sizeBucket: '',
	active: '',
	stack: '',
	scoreMin: '',
	sort: 'relevance' as const,
	page: 1,
	pageSize: 100,
};

export const load: PageServerLoad = () => {
	const teamsData = listTeams(defaultFilters);
	const employees = getAllEmployeeListItems();
	const onboarding = getOnboardingDashboard();
	const infra = getInfraDashboard();
	const training = getTrainingDashboard();

	const avgScore = teamsData.items.length === 0 ? 0 : Math.round(
		teamsData.items.reduce((s, t) => s + t.aggregatedScore, 0) / teamsData.items.length
	);

	return {
		kpis: {
			totalTeams: teamsData.items.length,
			totalEmployees: employees.length,
			avgCompositeScore: avgScore,
			activeOnboardings: onboarding.activeOnboardings,
			trainingCompletion: training.overallCompletionRate,
			totalInfraAssets: infra.totalAssets,
		},
		onboarding,
		training,
	};
};
