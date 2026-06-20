import { render } from '@testing-library/svelte';
import { getAdminScorePreview, getScoringConfig, validateScoringConfig } from '$lib/mock/kypData';
import { describe, expect, it } from 'vitest';
import AdminScoringPage from './+page.svelte';

describe('Admin scoring page', () => {
	it('shows validation messaging for invalid draft config', () => {
		const config = getScoringConfig();
		const invalidConfig = {
			...config,
			weights: {
				...config.weights,
				codeQuality: 5
			}
		};

		const validation = validateScoringConfig(invalidConfig);
		const { getByTestId, getByText } = render(AdminScoringPage, {
			data: {
				config,
				validation: validateScoringConfig(config),
				preview: getAdminScorePreview(config)
			},
			form: {
				success: false,
				config: invalidConfig,
				validation,
				preview: getAdminScorePreview(invalidConfig),
				message: 'Configuration was not saved.'
			}
		});

		expect(getByTestId('config-validation-errors')).toBeInTheDocument();
		expect(getByText('Weights must add up to exactly 100.')).toBeInTheDocument();
		expect(getByTestId('config-status-note').textContent).toContain('Configuration was not saved.');
	});
});
