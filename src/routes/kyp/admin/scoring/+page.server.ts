import {
	getAdminScorePreview,
	getDefaultScoringConfig,
	getScoringConfig,
	updateScoringConfig,
	validateScoringConfig
} from '$lib/mock/kypData';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

function parseWeight(value: FormDataEntryValue | null, fallback: number): number {
	if (value === null || value === '') {
		return fallback;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

export const load: PageServerLoad = () => {
	const config = getScoringConfig();
	return {
		config,
		validation: validateScoringConfig(config),
		preview: getAdminScorePreview(config)
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const current = getScoringConfig();
		const defaultConfig = getDefaultScoringConfig();
		const intent = String(formData.get('intent') ?? 'save');

		if (intent === 'reset') {
			const resetConfig = updateScoringConfig(defaultConfig);
			return {
				success: true,
				config: resetConfig,
				validation: validateScoringConfig(resetConfig),
				preview: getAdminScorePreview(resetConfig),
				message: 'Configuration reset to defaults.'
			};
		}

		const draft = {
			...current,
			sources: {
				bitbucket: { ...current.sources.bitbucket, enabled: formData.get('source-bitbucket') === 'on' },
				github: { ...current.sources.github, enabled: formData.get('source-github') === 'on' },
				jenkins: { ...current.sources.jenkins, enabled: formData.get('source-jenkins') === 'on' },
				productionDefects: {
					...current.sources.productionDefects,
					enabled: formData.get('source-productionDefects') === 'on'
				},
				hotfixes: { ...current.sources.hotfixes, enabled: formData.get('source-hotfixes') === 'on' },
				gcp: { ...current.sources.gcp, enabled: formData.get('source-gcp') === 'on' },
				sonar: { ...current.sources.sonar, enabled: formData.get('source-sonar') === 'on' }
			},
			weights: {
				codeQuality: parseWeight(formData.get('weight-codeQuality'), current.weights.codeQuality),
				prActivity: parseWeight(formData.get('weight-prActivity'), current.weights.prActivity),
				deployments: parseWeight(formData.get('weight-deployments'), current.weights.deployments),
				defectsMttr: parseWeight(formData.get('weight-defectsMttr'), current.weights.defectsMttr),
				hotfixes: parseWeight(formData.get('weight-hotfixes'), current.weights.hotfixes),
				gcp: parseWeight(formData.get('weight-gcp'), current.weights.gcp)
			}
		};

		const validation = validateScoringConfig(draft);
		if (!validation.isValid) {
			return fail(400, {
				success: false,
				config: draft,
				validation,
				preview: getAdminScorePreview(draft),
				message: 'Configuration was not saved.'
			});
		}

		const next = updateScoringConfig(draft);
		return {
			success: true,
			config: next,
			validation: validateScoringConfig(next),
			preview: getAdminScorePreview(next),
			message: 'Configuration updated for this mock environment.'
		};
	}
};
