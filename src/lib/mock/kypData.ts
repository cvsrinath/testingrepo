import type {
	AlertItem,
	EmployeeDetail,
	EmployeeSummary,
	MetricSnapshot,
	PeriodOption,
	SortableMetric,
	TrendPoint
} from '$lib/types/kyp';

export const periodOptions: PeriodOption[] = ['Q', '6M', 'YTD', 'Custom'];
export const defaultPeriod: PeriodOption = 'YTD';
export const teamName = 'Team Alpha';
export const reportLastUpdated = '2026-03-30T16:45:00Z';

export const metricLabels: Record<SortableMetric, string> = {
	compositeScore: 'Composite',
	commitsPerWeek: 'Commits/Wk',
	prThroughput: 'PR Throughput',
	reviewEngagement: 'Review Engagement',
	impactScore: 'Impact',
	codeQualityScore: 'Code Quality'
};

const baseEmployees: EmployeeSummary[] = [
	{
		userId: 'alex-rivera',
		displayName: 'Alex Rivera',
		avatarInitials: 'AR',
		roleLevel: 'L5',
		teamName,
		activeWeeks: 44,
		periodCoverage: '10 of 12 months active',
		lastUpdated: reportLastUpdated,
		compositeScore: 64.6,
		commitsPerWeek: 8.3,
		prThroughput: 23,
		reviewEngagement: 142,
		impactScore: 184,
		codeQualityScore: 78.4
	},
	{
		userId: 'maria-owens',
		displayName: 'Maria Owens',
		avatarInitials: 'MO',
		roleLevel: 'L4',
		teamName,
		activeWeeks: 48,
		periodCoverage: '12 of 12 months active',
		lastUpdated: reportLastUpdated,
		compositeScore: 71.4,
		commitsPerWeek: 7.1,
		prThroughput: 27,
		reviewEngagement: 188,
		impactScore: 214,
		codeQualityScore: 82.1
	}
];

const generatedEmployees: EmployeeSummary[] = Array.from({ length: 48 }, (_, idx) => {
	const id = idx + 3;
	return {
		userId: `employee-${id}`,
		displayName: `Employee ${id}`,
		avatarInitials: `E${id}`,
		roleLevel: idx % 3 === 0 ? 'L3' : idx % 3 === 1 ? 'L4' : 'L5',
		teamName,
		activeWeeks: 38 + (idx % 11),
		periodCoverage: `${8 + (idx % 5)} of 12 months active`,
		lastUpdated: reportLastUpdated,
		compositeScore: Number((52 + ((idx * 1.37) % 30)).toFixed(1)),
		commitsPerWeek: Number((4 + ((idx * 0.33) % 7)).toFixed(1)),
		prThroughput: Number((11 + ((idx * 1.8) % 20)).toFixed(1)),
		reviewEngagement: Number((80 + ((idx * 6.2) % 140)).toFixed(1)),
		impactScore: Number((95 + ((idx * 4.4) % 180)).toFixed(1)),
		codeQualityScore: Number((60 + ((idx * 1.95) % 32)).toFixed(1))
	};
});

export const teamRoster: EmployeeSummary[] = [...baseEmployees, ...generatedEmployees];

function metricSnapshotsFor(employee: EmployeeSummary): MetricSnapshot[] {
	return [
		{
			metricKey: 'commits_per_week',
			metricLabel: 'Commits / Active Week',
			rawValue: employee.commitsPerWeek,
			normalizedScore: Number((employee.commitsPerWeek * 7.3).toFixed(1)),
			zScore: Number(((employee.commitsPerWeek - 6.8) / 2.1).toFixed(2)),
			dimension: 'Output',
			lastUpdated: employee.lastUpdated
		},
		{
			metricKey: 'pr_throughput',
			metricLabel: 'PR Throughput',
			rawValue: employee.prThroughput,
			normalizedScore: Number((employee.prThroughput * 2.5).toFixed(1)),
			zScore: Number(((employee.prThroughput - 19) / 7.4).toFixed(2)),
			dimension: 'Output',
			lastUpdated: employee.lastUpdated
		},
		{
			metricKey: 'review_engagement',
			metricLabel: 'Review Engagement',
			rawValue: employee.reviewEngagement,
			normalizedScore: Number((employee.reviewEngagement / 2.3).toFixed(1)),
			zScore: Number(((employee.reviewEngagement - 132) / 45).toFixed(2)),
			dimension: 'Collaboration',
			lastUpdated: employee.lastUpdated
		},
		{
			metricKey: 'impact_score',
			metricLabel: 'Impact Score',
			rawValue: employee.impactScore,
			normalizedScore: Number((employee.impactScore / 3.2).toFixed(1)),
			zScore: Number(((employee.impactScore - 165) / 40).toFixed(2)),
			dimension: 'Impact',
			lastUpdated: employee.lastUpdated
		},
		{
			metricKey: 'code_quality',
			metricLabel: 'Code Quality',
			rawValue: employee.codeQualityScore,
			normalizedScore: employee.codeQualityScore,
			zScore: Number(((employee.codeQualityScore - 74) / 6.8).toFixed(2)),
			dimension: 'Quality',
			lastUpdated: employee.lastUpdated
		}
	];
}

function trendPoints(metricBase: number): TrendPoint[] {
	const start = new Date('2026-01-01T00:00:00Z');
	return Array.from({ length: 13 }, (_, i) => {
		const weekDate = new Date(start);
		weekDate.setUTCDate(start.getUTCDate() + i * 7);
		return {
			week: weekDate.toISOString().split('T')[0],
			value: Number((metricBase + Math.sin(i / 2) * 6 + (i % 4)).toFixed(1))
		};
	});
}

function detailFor(employee: EmployeeSummary): EmployeeDetail {
	return {
		...employee,
		metricSnapshots: metricSnapshotsFor(employee),
		dimensions: [
			{ dimension: 'Output', score: Number((employee.compositeScore + 4).toFixed(1)) },
			{ dimension: 'Impact', score: Number((employee.compositeScore + 1.5).toFixed(1)) },
			{ dimension: 'Quality', score: Number((employee.codeQualityScore - 2).toFixed(1)) },
			{ dimension: 'Collaboration', score: Number((employee.compositeScore + 7).toFixed(1)) },
			{ dimension: 'Knowledge Sharing', score: Number((employee.compositeScore - 5).toFixed(1)) }
		],
		trends: {
			'Commits / Week': trendPoints(employee.commitsPerWeek * 8),
			'PR Throughput': trendPoints(employee.prThroughput * 2),
			'Impact Score': trendPoints(employee.impactScore / 3),
			'Code Quality': trendPoints(employee.codeQualityScore)
		},
		contributions: [
			{
				label: 'Merged PR events',
				sourceType: 'Bitbucket',
				count: Math.round(employee.prThroughput),
				link: 'https://bitbucket.org'
			},
			{
				label: 'Resolved stories',
				sourceType: 'Jira',
				count: Math.round(employee.impactScore / 8),
				link: 'https://atlassian.com/software/jira'
			},
			{
				label: 'Coverage reports',
				sourceType: 'Coverage',
				count: Math.max(6, Math.round(employee.codeQualityScore / 10)),
				link: 'https://example-ci.local'
			}
		],
		improvementSuggestions: [
			'Keep PR batch size under XL threshold to preserve cycle time.',
			'Increase documentation touchpoints for high-impact stories.',
			'Maintain review consistency during sprint close week.'
		]
	};
}

const detailMap = new Map<string, EmployeeDetail>(teamRoster.map((employee) => [employee.userId, detailFor(employee)]));

export const alerts: AlertItem[] = [
	{
		id: 'a-1',
		severity: 'warning',
		text: '2 accounts flagged for alias conflicts; excluded from cohort ranking.'
	},
	{
		id: 'a-2',
		severity: 'info',
		text: 'Commit reconciliation healthy at 99.4% for the selected period.'
	},
	{
		id: 'a-3',
		severity: 'critical',
		text: 'Data freshness breached 30m for one connector in the last 24h.'
	}
];

export const weightPresets = ['IC Engineer', 'Senior Engineer', 'Staff Engineer', 'Engineering Manager'];

export function getEmployeeDetail(id: string): EmployeeDetail | undefined {
	return detailMap.get(id);
}
