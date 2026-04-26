import { getScoringConfig, updateScoringConfig, validateScoringConfig } from '$lib/mock/kypData';
import { json } from '@sveltejs/kit';

export function GET() {
	return json(getScoringConfig());
}

export async function PUT({ request }) {
	const body = await request.json();
	const current = getScoringConfig();
	const draft = {
		...current,
		...body,
		sources: body.sources ? { ...current.sources, ...body.sources } : current.sources,
		weights: body.weights ? { ...current.weights, ...body.weights } : current.weights,
		normalization: body.normalization ? { ...current.normalization, ...body.normalization } : current.normalization
	};

	const validation = validateScoringConfig(draft);
	if (!validation.isValid) {
		return json({ message: 'Invalid scoring configuration.', validation }, { status: 400 });
	}

	return json({
		config: updateScoringConfig(draft),
		validation
	});
}
