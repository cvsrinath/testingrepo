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

export type SourceName =
	| 'bitbucket'
	| 'github'
	| 'jenkins'
	| 'productionDefects'
	| 'hotfixes'
	| 'gcp'
	| 'sonar';

export type TeamSizeBucket = '5-6' | '8-10' | '10-15' | '15-18';
export type TeamSortOption = 'relevance' | 'score_desc' | 'name_asc' | 'last_activity_desc';
export type EmployeeStatus = 'active' | 'inactive';

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
	sourceType: 'Bitbucket' | 'GitHub' | 'Jira' | 'Coverage' | 'Jenkins' | 'GCP';
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
	teamId?: string;
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

export interface TeamSourceMetrics {
	codeQuality: number;
	prActivity: number;
	deployments: number;
	defectsMttr: number;
	hotfixes: number;
	gcp: number;
}

export interface TeamListItem {
	teamId: string;
	orgId: string;
	name: string;
	region: string;
	size: number;
	sizeBucket: TeamSizeBucket;
	activeFlag: boolean;
	techStack: string[];
	aggregatedScore: number;
	lastDeploymentAt: string;
	lastActivityAt: string;
	memberCount: number;
	sourceHealth: string;
}

export interface TeamMemberListItem {
	employeeId: string;
	displayName: string;
	roleLevel: string;
	status: EmployeeStatus;
	contributions30d: number;
	lastActivityAt: string;
	teamId: string;
	teamName: string;
}

export interface TeamDetail extends TeamListItem {
	scoreBreakdown: TeamSourceMetrics;
	metrics: {
		prThroughput30d: number;
		prReviewTimeHours: number;
		mergeRate: number;
		deploymentFrequency30d: number;
		prodBuildSuccessRate: number;
		mttrHours30d: number;
		productionDefects30d: number;
		hotfixCount30d: number;
		gcpChanges30d: number;
		gcpIncidents30d: number;
	};
	members: TeamMemberListItem[];
	alerts: AlertItem[];
}

export interface TeamFilterState {
	q: string;
	region: string;
	sizeBucket: string;
	active: string;
	stack: string;
	scoreMin: string;
	sort: TeamSortOption;
	page: number;
	pageSize: number;
}

export interface SourceConfig {
	enabled: boolean;
	label: string;
}

export interface ScoringWeights {
	codeQuality: number;
	prActivity: number;
	deployments: number;
	defectsMttr: number;
	hotfixes: number;
	gcp: number;
}

export interface ScoringConfig {
	scopeType: 'org' | 'supervisor';
	scopeId: string;
	sources: Record<SourceName, SourceConfig>;
	weights: ScoringWeights;
	normalization: {
		missingDataPolicy: 'reweight_enabled_sources' | 'neutral_50';
		winsorizePercentile: number;
	};
	updatedAt: string;
}

export interface ScoringConfigValidation {
	isValid: boolean;
	errors: string[];
	totalWeight: number;
	enabledSourceCount: number;
}

export interface TeamSearchResponse {
	items: TeamListItem[];
	total: number;
	page: number;
	pageSize: number;
	suggestions: Array<{ type: 'team' | 'member'; id: string; label: string; meta: string }>;
	availableRegions: string[];
	availableStacks: string[];
}
