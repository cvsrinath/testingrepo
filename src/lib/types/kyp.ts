export type PeriodOption = 'Q' | '6M' | 'YTD' | 'Custom';
export type WeightPreset = 'IC Engineer' | 'Senior Engineer' | 'Staff Engineer' | 'Engineering Manager';

export type SortDirection = 'asc' | 'desc';

export type SortableMetric =
	| 'compositeScore'
	| 'commitsPerWeek'
	| 'prThroughput'
	| 'reviewEngagement'
	| 'impactScore'
	| 'codeQualityScore';

export interface MetricSnapshot {
	metricKey: string;
	metricLabel: string;
	rawValue: number;
	normalizedScore: number;
	zScore: number;
	dimension: string;
	lastUpdated: string;
}

export interface DimensionScore {
	dimension: 'Output' | 'Impact' | 'Quality' | 'Collaboration' | 'Knowledge Sharing';
	score: number;
}

export interface TrendPoint {
	week: string;
	value: number;
}

export interface ContributionSource {
	label: string;
	sourceType: 'Bitbucket' | 'Jira' | 'Coverage';
	count: number;
	link: string;
}

export interface AlertItem {
	id: string;
	severity: 'info' | 'warning' | 'critical';
	text: string;
}

export interface EmployeeSummary {
	userId: string;
	displayName: string;
	avatarInitials: string;
	roleLevel: string;
	teamName: string;
	activeWeeks: number;
	periodCoverage: string;
	lastUpdated: string;
	compositeScore: number;
	commitsPerWeek: number;
	prThroughput: number;
	reviewEngagement: number;
	impactScore: number;
	codeQualityScore: number;
}

export interface EmployeeDetail extends EmployeeSummary {
	metricSnapshots: MetricSnapshot[];
	dimensions: DimensionScore[];
	trends: Record<string, TrendPoint[]>;
	contributions: ContributionSource[];
	improvementSuggestions: string[];
}

export interface PresetWeights {
	output: number;
	impact: number;
	quality: number;
	collaboration: number;
	knowledgeSharing: number;
}
