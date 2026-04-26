import { weightPresetMap } from '$lib/mock/kypData';
import type { EmployeeSummary, PeriodOption, WeightPreset } from '$lib/types/kyp';

export const periodCompositeMultipliers: Record<PeriodOption, number> = {
	Q: 0.932,
	'6M': 0.972,
	YTD: 1.0,
	Custom: 0.976
};

export const periodViewScalars: Record<
	PeriodOption,
	{
		activity: number;
		reliability: number;
		incidents: number;
		quality: number;
	}
> = {
	Q: {
		activity: 0.9,
		reliability: 0.94,
		incidents: 0.78,
		quality: 1.01
	},
	'6M': {
		activity: 0.96,
		reliability: 0.98,
		incidents: 0.9,
		quality: 1
	},
	YTD: {
		activity: 1,
		reliability: 1,
		incidents: 1,
		quality: 1
	},
	Custom: {
		activity: 0.93,
		reliability: 0.97,
		incidents: 0.84,
		quality: 1.03
	}
};

const periodMultipliers: Record<
	PeriodOption,
	{
		commitsPerWeek: number;
		prThroughput: number;
		reviewEngagement: number;
		impactScore: number;
		codeQualityScore: number;
	}
> = {
	Q: {
		commitsPerWeek: 0.92,
		prThroughput: 0.9,
		reviewEngagement: 0.95,
		impactScore: 0.88,
		codeQualityScore: 1.01
	},
	'6M': {
		commitsPerWeek: 0.97,
		prThroughput: 0.96,
		reviewEngagement: 0.98,
		impactScore: 0.95,
		codeQualityScore: 1
	},
	YTD: {
		commitsPerWeek: 1,
		prThroughput: 1,
		reviewEngagement: 1,
		impactScore: 1,
		codeQualityScore: 1
	},
	Custom: {
		commitsPerWeek: 0.95,
		prThroughput: 0.92,
		reviewEngagement: 1.03,
		impactScore: 0.94,
		codeQualityScore: 1.04
	}
};

function normalize(value: number, min: number, max: number): number {
	if (max === min) {
		return 50;
	}

	return ((value - min) / (max - min)) * 100;
}

function numberRange(rows: EmployeeSummary[], key: keyof EmployeeSummary): { min: number; max: number } {
	const values = rows.map((row) => Number(row[key]));
	return {
		min: Math.min(...values),
		max: Math.max(...values)
	};
}

function withPeriodVolatility(base: number, activeWeeks: number, factor: number): number {
	if (factor === 0) {
		return base;
	}

	const relativeShift = ((activeWeeks % 9) - 4) * factor;
	return base * (1 + relativeShift);
}

export function applyPeriodMetrics(rows: EmployeeSummary[], period: PeriodOption): EmployeeSummary[] {
	const multipliers = periodMultipliers[period];
	const volatilityFactor = period === 'Q' ? 0.012 : period === '6M' ? 0.008 : period === 'Custom' ? 0.01 : 0;

	return rows.map((row) => ({
		...row,
		periodCoverage: `${period} view - ${row.periodCoverage}`,
		commitsPerWeek: Number(
			withPeriodVolatility(row.commitsPerWeek * multipliers.commitsPerWeek, row.activeWeeks, volatilityFactor).toFixed(1)
		),
		prThroughput: Number(
			withPeriodVolatility(row.prThroughput * multipliers.prThroughput, row.activeWeeks + 2, volatilityFactor).toFixed(1)
		),
		reviewEngagement: Number(
			withPeriodVolatility(
				row.reviewEngagement * multipliers.reviewEngagement,
				row.activeWeeks + 4,
				volatilityFactor
			).toFixed(1)
		),
		impactScore: Number(
			withPeriodVolatility(row.impactScore * multipliers.impactScore, row.activeWeeks + 6, volatilityFactor).toFixed(1)
		),
		codeQualityScore: Number(
			withPeriodVolatility(
				row.codeQualityScore * multipliers.codeQualityScore,
				row.activeWeeks + 8,
				volatilityFactor
			).toFixed(1)
		)
	}));
}

export function applyWeightPreset(rows: EmployeeSummary[], preset: WeightPreset): EmployeeSummary[] {
	const weights = weightPresetMap[preset];

	const commitsRange = numberRange(rows, 'commitsPerWeek');
	const prRange = numberRange(rows, 'prThroughput');
	const reviewRange = numberRange(rows, 'reviewEngagement');
	const impactRange = numberRange(rows, 'impactScore');
	const qualityRange = numberRange(rows, 'codeQualityScore');

	return rows.map((row) => {
		const output = (normalize(row.commitsPerWeek, commitsRange.min, commitsRange.max) +
			normalize(row.prThroughput, prRange.min, prRange.max)) /
			2;
		const impact = normalize(row.impactScore, impactRange.min, impactRange.max);
		const quality = normalize(row.codeQualityScore, qualityRange.min, qualityRange.max);
		const collaboration = normalize(row.reviewEngagement, reviewRange.min, reviewRange.max);
		const knowledgeSharing = (collaboration + quality) / 2;

		const compositeScore =
			output * weights.output +
			impact * weights.impact +
			quality * weights.quality +
			collaboration * weights.collaboration +
			knowledgeSharing * weights.knowledgeSharing;

		return {
			...row,
			compositeScore: Number(compositeScore.toFixed(1))
		};
	});
}
