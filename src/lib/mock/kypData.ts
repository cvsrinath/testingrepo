import type {
	AlertItem,
	ContributionSource,
	EmployeeDetail,
	EmployeeSummary,
	MetricSnapshot,
	PeriodOption,
	PresetWeights,
	ScoringConfig,
	ScoringConfigValidation,
	ScoringWeights,
	SortableMetric,
	SourceName,
	TeamDetail,
	TeamFilterState,
	TeamListItem,
	TeamMemberListItem,
	TeamSearchResponse,
	TeamSizeBucket,
	TeamSortOption,
	TeamSourceMetrics,
	TrendPoint,
	WeightPreset
} from '$lib/types/kyp';

export const periodOptions: PeriodOption[] = ['Q', '6M', 'YTD', 'Custom'];
export const defaultPeriod: PeriodOption = 'YTD';
export const reportLastUpdated = '2026-03-30T16:45:00Z';
export const teamName = 'Team Alpha';

export const metricLabels: Record<SortableMetric, string> = {
	compositeScore: 'Composite',
	commitsPerWeek: 'Commits/Wk',
	prThroughput: 'PR Throughput',
	reviewEngagement: 'Review Engagement',
	impactScore: 'Impact',
	codeQualityScore: 'Code Quality'
};

export const weightPresets: WeightPreset[] = [
	'IC Engineer',
	'Senior Engineer',
	'Staff Engineer',
	'Engineering Manager'
];

export const weightPresetMap: Record<WeightPreset, PresetWeights> = {
	'IC Engineer': {
		output: 0.35,
		impact: 0.3,
		quality: 0.2,
		collaboration: 0.1,
		knowledgeSharing: 0.05
	},
	'Senior Engineer': {
		output: 0.25,
		impact: 0.3,
		quality: 0.2,
		collaboration: 0.15,
		knowledgeSharing: 0.1
	},
	'Staff Engineer': {
		output: 0.15,
		impact: 0.25,
		quality: 0.2,
		collaboration: 0.2,
		knowledgeSharing: 0.2
	},
	'Engineering Manager': {
		output: 0.1,
		impact: 0.2,
		quality: 0.1,
		collaboration: 0.2,
		knowledgeSharing: 0.4
	}
};

export const weightPresetDescriptions: Record<WeightPreset, string> = {
	'IC Engineer': 'Output-heavy baseline for IC contributors.',
	'Senior Engineer': 'Balanced output + impact with higher collaboration weight.',
	'Staff Engineer': 'Influence-oriented weighting emphasizing collaboration and sharing.',
	'Engineering Manager': 'Leadership weighting with strongest knowledge-sharing emphasis.'
};

export const periodDescriptions: Record<PeriodOption, string> = {
	Q: 'Quarter snapshot emphasizing recent activity velocity.',
	'6M': 'Medium-term trend view balancing recency and stability.',
	YTD: 'Year-to-date baseline with full-period normalization.',
	Custom: 'Quality-calibrated custom window for focused review scenarios.'
};

const sourceLabels: Record<SourceName, string> = {
	bitbucket: 'Bitbucket',
	github: 'GitHub',
	jenkins: 'Jenkins',
	productionDefects: 'Production Defects',
	hotfixes: 'Hotfixes',
	gcp: 'GCP',
	sonar: 'Sonar'
};

const regionOptions = ['NA', 'EMEA', 'APAC', 'LATAM'];
const stackOptions = ['Node.js', 'Java', 'Python', 'Go', 'GCP', 'AWS', 'React'];

const defaultScoringWeights: ScoringWeights = {
	codeQuality: 20,
	prActivity: 20,
	deployments: 15,
	defectsMttr: 25,
	hotfixes: 10,
	gcp: 10
};

const defaultScoringConfig: ScoringConfig = {
	scopeType: 'org',
	scopeId: 'org-global',
	sources: {
		bitbucket: { enabled: true, label: sourceLabels.bitbucket },
		github: { enabled: true, label: sourceLabels.github },
		jenkins: { enabled: true, label: sourceLabels.jenkins },
		productionDefects: { enabled: true, label: sourceLabels.productionDefects },
		hotfixes: { enabled: true, label: sourceLabels.hotfixes },
		gcp: { enabled: true, label: sourceLabels.gcp },
		sonar: { enabled: true, label: sourceLabels.sonar }
	},
	weights: defaultScoringWeights,
	normalization: {
		missingDataPolicy: 'reweight_enabled_sources',
		winsorizePercentile: 0.95
	},
	updatedAt: reportLastUpdated
};

// Module-level mutable state: intentional for this prototype. Changes persist within a browser session but reset on page reload, since there is no backend persistence layer.
let activeScoringConfig: ScoringConfig = structuredClone(defaultScoringConfig);

type TeamMetricsSeed = {
	codeQuality: number;
	bitbucketThroughput: number;
	githubThroughput: number;
	reviewTimeHours: number;
	mergeRate: number;
	deploymentFrequency30d: number;
	prodBuildSuccessRate: number;
	mttrHours30d: number;
	productionDefects30d: number;
	hotfixCount30d: number;
	gcpChanges30d: number;
	gcpIncidents30d: number;
	lastDeploymentAt: string;
	lastActivityAt: string;
};

type TeamSeed = {
	teamId: string;
	orgId: string;
	name: string;
	region: string;
	activeFlag: boolean;
	techStack: readonly string[];
	supervisorName: string;
	alerts: readonly AlertItem[];
	metricsSeed: TeamMetricsSeed;
	members: EmployeeSummary[];
};

function sizeBucketFor(size: number): TeamSizeBucket {
	if (size <= 6) {
		return '5-6';
	}
	if (size <= 10) {
		return '8-10';
	}
	if (size <= 15) {
		return '10-15';
	}
	return '15-18';
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function normalizePositive(value: number, target: number): number {
	return clamp((value / target) * 100, 0, 100);
}

function normalizeInverse(value: number, threshold: number): number {
	return clamp(100 - (value / threshold) * 100, 0, 100);
}

function initialsFor(name: string): string {
	return name
		.split(' ')
		.map((part) => part[0] ?? '')
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

function slugFor(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildEmployee(
	index: number,
	name: string,
	roleLevel: string,
	teamId: string,
	team: string,
	metricOffset: number
): EmployeeSummary {
	if (name === 'Alex Rivera') {
		return {
			userId: slugFor(name),
			displayName: name,
			avatarInitials: initialsFor(name),
			roleLevel,
			teamId,
			teamName: team,
			activeWeeks: 44,
			periodCoverage: '10 of 12 months active',
			lastUpdated: reportLastUpdated,
			compositeScore: 64.6,
			commitsPerWeek: 8.3,
			prThroughput: 23,
			reviewEngagement: 142,
			impactScore: 184,
			codeQualityScore: 78.4
		};
	}

	if (name === 'Maria Owens') {
		return {
			userId: slugFor(name),
			displayName: name,
			avatarInitials: initialsFor(name),
			roleLevel,
			teamId,
			teamName: team,
			activeWeeks: 48,
			periodCoverage: '12 of 12 months active',
			lastUpdated: reportLastUpdated,
			compositeScore: 71.4,
			commitsPerWeek: 7.1,
			prThroughput: 27,
			reviewEngagement: 188,
			impactScore: 214,
			codeQualityScore: 82.1
		};
	}

	return {
		userId: slugFor(name),
		displayName: name,
		avatarInitials: initialsFor(name),
		roleLevel,
		teamId,
		teamName: team,
		activeWeeks: 38 + ((metricOffset + index) % 11),
		periodCoverage: `${8 + ((metricOffset + index) % 5)} of 12 months active`,
		lastUpdated: reportLastUpdated,
		compositeScore: Number((58 + ((metricOffset + index) % 20) * 1.4).toFixed(1)),
		commitsPerWeek: Number((4.8 + ((metricOffset + index) % 9) * 0.5).toFixed(1)),
		prThroughput: Number((12 + ((metricOffset + index) % 10) * 1.8).toFixed(1)),
		reviewEngagement: Number((86 + ((metricOffset + index) % 12) * 8.6).toFixed(1)),
		impactScore: Number((110 + ((metricOffset + index) % 12) * 10.7).toFixed(1)),
		codeQualityScore: Number((66 + ((metricOffset + index) % 10) * 2.1).toFixed(1))
	};
}

const rosterBlueprints = [
	{
		teamId: 'team-alpha',
		orgId: 'org-global',
		name: 'Team Alpha',
		region: 'NA',
		activeFlag: true,
		techStack: ['Node.js', 'React', 'GCP'],
		supervisorName: 'Jordan Lee',
		memberNames: [
			['Alex Rivera', 'L5'],
			['Maria Owens', 'L4'],
			['Priya Shah', 'L4'],
			['Leo Martin', 'L3'],
			['Nina Patel', 'L5'],
			['Owen Brooks', 'L3']
		],
		metricOffset: 0,
		metricsSeed: {
			codeQuality: 82,
			bitbucketThroughput: 72,
			githubThroughput: 68,
			reviewTimeHours: 9.8,
			mergeRate: 0.92,
			deploymentFrequency30d: 14,
			prodBuildSuccessRate: 0.97,
			mttrHours30d: 3.1,
			productionDefects30d: 2,
			hotfixCount30d: 1,
			gcpChanges30d: 11,
			gcpIncidents30d: 1,
			lastDeploymentAt: '2026-03-29T18:10:00Z',
			lastActivityAt: '2026-03-30T16:45:00Z'
		},
		alerts: [
			{ id: 'alpha-1', severity: 'warning', text: 'One prod hotfix in the last 30 days increased change-failure review load.' },
			{ id: 'alpha-2', severity: 'info', text: 'GitHub review turnaround improved 18% week over week.' }
		]
	},
	{
		teamId: 'team-beacon',
		orgId: 'org-global',
		name: 'Team Beacon',
		region: 'EMEA',
		activeFlag: true,
		techStack: ['Java', 'AWS'],
		supervisorName: 'Samira Khan',
		memberNames: [
			['Marta Klein', 'L5'],
			['Jonas Berg', 'L4'],
			['Lucia Rossi', 'L4'],
			['Arun Menon', 'L3'],
			['Tobias Weber', 'L3'],
			['Rina Das', 'L4'],
			['Noah Price', 'L5'],
			['Ella Green', 'L3'],
			['Kian Holt', 'L4']
		],
		metricOffset: 4,
		metricsSeed: {
			codeQuality: 76,
			bitbucketThroughput: 65,
			githubThroughput: 74,
			reviewTimeHours: 12.4,
			mergeRate: 0.88,
			deploymentFrequency30d: 11,
			prodBuildSuccessRate: 0.94,
			mttrHours30d: 4.8,
			productionDefects30d: 3,
			hotfixCount30d: 2,
			gcpChanges30d: 4,
			gcpIncidents30d: 0,
			lastDeploymentAt: '2026-03-28T11:35:00Z',
			lastActivityAt: '2026-03-30T15:20:00Z'
		},
		alerts: [{ id: 'beacon-1', severity: 'critical', text: 'Two Sev2 production defects were linked to the March billing rollout.' }]
	},
	{
		teamId: 'team-cirrus',
		orgId: 'org-global',
		name: 'Team Cirrus',
		region: 'APAC',
		activeFlag: true,
		techStack: ['Python', 'GCP'],
		supervisorName: 'Akira Sato',
		memberNames: [
			['Aiko Tan', 'L5'],
			['Min Seo', 'L4'],
			['Harish Iyer', 'L4'],
			['Yuna Park', 'L3'],
			['Kenji Mori', 'L3'],
			['Gia Tran', 'L4'],
			['Wei Lin', 'L5'],
			['Tara Singh', 'L4'],
			['Luis Ortega', 'L3'],
			['Mina Rahman', 'L4'],
			['Ravi Kumar', 'L3'],
			['Sophie Ng', 'L5']
		],
		metricOffset: 8,
		metricsSeed: {
			codeQuality: 84,
			bitbucketThroughput: 69,
			githubThroughput: 79,
			reviewTimeHours: 8.1,
			mergeRate: 0.95,
			deploymentFrequency30d: 18,
			prodBuildSuccessRate: 0.98,
			mttrHours30d: 2.4,
			productionDefects30d: 1,
			hotfixCount30d: 0,
			gcpChanges30d: 18,
			gcpIncidents30d: 1,
			lastDeploymentAt: '2026-03-30T07:40:00Z',
			lastActivityAt: '2026-03-30T16:42:00Z'
		},
		alerts: [{ id: 'cirrus-1', severity: 'info', text: 'Cloud Build stability remained above 98% for the quarter.' }]
	},
	{
		teamId: 'team-delta',
		orgId: 'org-global',
		name: 'Team Delta',
		region: 'LATAM',
		activeFlag: false,
		techStack: ['Go', 'AWS'],
		supervisorName: 'Camila Reyes',
		memberNames: [
			['Diego Soto', 'L5'],
			['Valeria Cruz', 'L4'],
			['Pedro Lima', 'L3'],
			['Ana Costa', 'L4'],
			['Marco Silva', 'L3'],
			['Isabel Mora', 'L4'],
			['Mateo Ruiz', 'L3'],
			['Lara Pinto', 'L5'],
			['Nico Alves', 'L4'],
			['Paula Diaz', 'L3'],
			['Rosa Vega', 'L4'],
			['Hugo Diaz', 'L3'],
			['Cesar Mendez', 'L4'],
			['Julia Rios', 'L5'],
			['Bruno Neri', 'L3'],
			['Elena Voss', 'L4']
		],
		metricOffset: 12,
		metricsSeed: {
			codeQuality: 71,
			bitbucketThroughput: 58,
			githubThroughput: 52,
			reviewTimeHours: 16.7,
			mergeRate: 0.82,
			deploymentFrequency30d: 8,
			prodBuildSuccessRate: 0.9,
			mttrHours30d: 6.8,
			productionDefects30d: 5,
			hotfixCount30d: 3,
			gcpChanges30d: 0,
			gcpIncidents30d: 0,
			lastDeploymentAt: '2026-03-22T12:15:00Z',
			lastActivityAt: '2026-03-25T18:05:00Z'
		},
		alerts: [{ id: 'delta-1', severity: 'warning', text: 'Inactive delivery pod retained historical defects that still affect trend comparisons.' }]
	}
] as const;

function toEmployeeMembers(blueprint: (typeof rosterBlueprints)[number]): EmployeeSummary[] {
	return blueprint.memberNames.map(([name, roleLevel], index) =>
		buildEmployee(index, name, roleLevel, blueprint.teamId, blueprint.name, blueprint.metricOffset)
	);
}

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

const teamsSeed: TeamSeed[] = rosterBlueprints.map((blueprint) => ({
	...blueprint,
	members: toEmployeeMembers(blueprint)
}));

const teamMap = new Map<string, TeamSeed>(teamsSeed.map((team) => [team.teamId, team]));
const employeeTeamMap = new Map<string, TeamSeed>();
for (const team of teamsSeed) {
	for (const member of team.members) {
		employeeTeamMap.set(member.userId, team);
	}
}

export const teamRoster: EmployeeSummary[] = teamMap.get('team-alpha')?.members ?? [];

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

function improvementSuggestionsFor(employee: EmployeeSummary): string[] {
	const suggestions: string[] = [];

	if (employee.reviewEngagement < 110) {
		suggestions.push(
			'Boost code review participation; engagement is below team median. Aim for at least 2 structured review sessions per sprint.'
		);
	}
	if (employee.commitsPerWeek < 5.5) {
		suggestions.push(
			'Increase commit frequency. Smaller, focused commits improve traceability and shorten CI feedback cycles.'
		);
	}
	if (employee.codeQualityScore < 68) {
		suggestions.push(
			'Code quality score is below threshold. Address open static analysis findings and raise test coverage on recent PRs.'
		);
	}
	if (employee.prThroughput < 16) {
		suggestions.push(
			'Reduce PR batch size. Smaller pull requests typically get reviewed and merged faster.'
		);
	}
	if (employee.impactScore < 130) {
		suggestions.push(
			'Seek higher-complexity ownership areas to grow your impact footprint and delivery scope.'
		);
	}

	if (suggestions.length === 0) {
		suggestions.push('Maintain current PR batch size; current review cadence is sustaining healthy cycle time.');
	}
	if (suggestions.length < 2) {
		suggestions.push('Strong review engagement. Consider mentoring newer team members through structured pairing sessions.');
	}
	if (suggestions.length < 3) {
		suggestions.push('Output and impact remain above team median; focus on knowledge sharing for broader leverage.');
	}

	return suggestions.slice(0, 4);
}

function employeeContributionSources(employee: EmployeeSummary, team: TeamSeed): ContributionSource[] {
	return [
		{
			label: 'Merged PR events',
			sourceType: 'Bitbucket',
			count: Math.round(employee.prThroughput * 0.55),
			link: 'https://bitbucket.org'
		},
		{
			label: 'GitHub reviews and comments',
			sourceType: 'GitHub',
			count: Math.round(employee.reviewEngagement / 9),
			link: 'https://github.com'
		},
		{
			label: 'Resolved stories and incidents',
			sourceType: 'Jira',
			count: Math.round(employee.impactScore / 11),
			link: 'https://atlassian.com/software/jira'
		},
		{
			label: 'Coverage and deployment checks',
			sourceType: team.techStack.includes('GCP') ? 'GCP' : 'Jenkins',
			count: Math.max(6, Math.round(employee.codeQualityScore / 9)),
			link: team.techStack.includes('GCP') ? 'https://cloud.google.com' : 'https://www.jenkins.io'
		},
		{
			label: 'Coverage reports',
			sourceType: 'Coverage',
			count: Math.max(6, Math.round(employee.codeQualityScore / 10)),
			link: 'https://example-ci.local'
		}
	];
}

function detailFor(employee: EmployeeSummary): EmployeeDetail {
	const team = employeeTeamMap.get(employee.userId);
	if (!team) {
		throw new Error(`Missing team for employee ${employee.userId}`);
	}

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
			'Code Quality': trendPoints(employee.codeQualityScore),
			'Deployment Touches': trendPoints((team.metricsSeed.deploymentFrequency30d / Math.max(team.members.length, 1)) * 14)
		},
		contributions: employeeContributionSources(employee, team),
		improvementSuggestions: improvementSuggestionsFor(employee)
	};
}

const detailMap = new Map<string, EmployeeDetail>();
for (const team of teamsSeed) {
	for (const employee of team.members) {
		detailMap.set(employee.userId, detailFor(employee));
	}
}

function teamBreakdown(team: TeamSeed, config: ScoringConfig): TeamSourceMetrics {
	const enabledThroughput =
		(config.sources.bitbucket.enabled ? team.metricsSeed.bitbucketThroughput : 0) +
		(config.sources.github.enabled ? team.metricsSeed.githubThroughput : 0);
	const prSignal = (normalizePositive(enabledThroughput, 150) * 0.45) +
		(normalizeInverse(team.metricsSeed.reviewTimeHours, 24) * 0.25) +
		(team.metricsSeed.mergeRate * 100 * 0.3);

	return {
		codeQuality: config.sources.sonar.enabled ? normalizePositive(team.metricsSeed.codeQuality, 90) : 0,
		prActivity: config.sources.github.enabled || config.sources.bitbucket.enabled ? Number(prSignal.toFixed(1)) : 0,
		deployments: config.sources.jenkins.enabled
			? Number(
					(
						normalizePositive(team.metricsSeed.deploymentFrequency30d, 20) * 0.6 +
						team.metricsSeed.prodBuildSuccessRate * 100 * 0.4
					).toFixed(1)
			  )
			: 0,
		defectsMttr: config.sources.productionDefects.enabled
			? Number(
					(
						normalizeInverse(team.metricsSeed.productionDefects30d, 8) * 0.5 +
						normalizeInverse(team.metricsSeed.mttrHours30d, 10) * 0.5
					).toFixed(1)
			  )
			: 0,
		hotfixes: config.sources.hotfixes.enabled ? Number(normalizeInverse(team.metricsSeed.hotfixCount30d, 6).toFixed(1)) : 0,
		gcp: config.sources.gcp.enabled
			? Number(
					(
						normalizePositive(team.metricsSeed.gcpChanges30d, 20) * 0.65 +
						normalizeInverse(team.metricsSeed.gcpIncidents30d, 6) * 0.35
					).toFixed(1)
			  )
			: 0
	};
}

function weightedTeamScore(breakdown: TeamSourceMetrics, config: ScoringConfig): number {
	const enabledEntries = [
		['codeQuality', breakdown.codeQuality, config.weights.codeQuality, config.sources.sonar.enabled],
		['prActivity', breakdown.prActivity, config.weights.prActivity, config.sources.github.enabled || config.sources.bitbucket.enabled],
		['deployments', breakdown.deployments, config.weights.deployments, config.sources.jenkins.enabled],
		['defectsMttr', breakdown.defectsMttr, config.weights.defectsMttr, config.sources.productionDefects.enabled],
		['hotfixes', breakdown.hotfixes, config.weights.hotfixes, config.sources.hotfixes.enabled],
		['gcp', breakdown.gcp, config.weights.gcp, config.sources.gcp.enabled]
	] as const;

	const activeWeights = enabledEntries.filter(([, , , enabled]) => enabled);
	const weightTotal = activeWeights.reduce((sum, [, , weight]) => sum + weight, 0);
	if (weightTotal === 0) {
		return 0;
	}

	const weightedValue = activeWeights.reduce((sum, [, value, weight]) => sum + value * weight, 0);
	return Number((weightedValue / weightTotal).toFixed(1));
}

function memberContributionScore(member: EmployeeSummary): number {
	return Math.round(member.prThroughput + member.reviewEngagement / 18 + member.impactScore / 24);
}

function toMemberListItem(team: TeamSeed, member: EmployeeSummary): TeamMemberListItem {
	return {
		employeeId: member.userId,
		displayName: member.displayName,
		roleLevel: member.roleLevel,
		status: team.activeFlag ? 'active' : 'inactive',
		contributions30d: memberContributionScore(member),
		lastActivityAt: member.lastUpdated,
		teamId: team.teamId,
		teamName: team.name
	};
}

function toTeamListItem(team: TeamSeed, config: ScoringConfig): TeamListItem {
	const breakdown = teamBreakdown(team, config);
	return {
		teamId: team.teamId,
		orgId: team.orgId,
		name: team.name,
		region: team.region,
		size: team.members.length,
		sizeBucket: sizeBucketFor(team.members.length),
		activeFlag: team.activeFlag,
		techStack: [...team.techStack],
		aggregatedScore: weightedTeamScore(breakdown, config),
		lastDeploymentAt: team.metricsSeed.lastDeploymentAt,
		lastActivityAt: team.metricsSeed.lastActivityAt,
		memberCount: team.members.length,
		sourceHealth: Object.values(config.sources).filter((source) => source.enabled).length >= 5 ? 'Healthy' : 'Partial'
	};
}

function searchSuggestions(query: string): TeamSearchResponse['suggestions'] {
	if (query.length < 2) {
		return [];
	}

	const normalized = query.toLowerCase();
	const teamSuggestions = teamsSeed
		.filter((team) => team.name.toLowerCase().includes(normalized) || team.teamId.toLowerCase().includes(normalized))
		.slice(0, 4)
		.map((team) => ({
			type: 'team' as const,
			id: team.teamId,
			label: team.name,
			meta: `${team.region} · ${team.members.length} members`
		}));

	const memberSuggestions = teamsSeed
		.flatMap((team) =>
			team.members
				.filter((member) => member.displayName.toLowerCase().includes(normalized))
				.slice(0, 3)
				.map((member) => ({
					type: 'member' as const,
					id: member.userId,
					label: member.displayName,
					meta: `${team.name} · ${member.roleLevel}`
				}))
		)
		.slice(0, 4);

	return [...teamSuggestions, ...memberSuggestions].slice(0, 6);
}

function applyTeamFilters(items: TeamListItem[], filters: TeamFilterState): TeamListItem[] {
	const query = filters.q.trim().toLowerCase();

	let output = items.filter((item) => {
		const matchesQuery =
			query.length === 0 ||
			item.name.toLowerCase().includes(query) ||
			item.teamId.toLowerCase().includes(query) ||
			teamMap
				.get(item.teamId)
				?.members.some((member) => member.displayName.toLowerCase().includes(query));

		const matchesRegion = !filters.region || item.region === filters.region;
		const matchesBucket = !filters.sizeBucket || item.sizeBucket === filters.sizeBucket;
		const matchesActive =
			!filters.active ||
			(filters.active === 'active' && item.activeFlag) ||
			(filters.active === 'inactive' && !item.activeFlag);
		const matchesStack = !filters.stack || item.techStack.includes(filters.stack);
		const matchesScore = !filters.scoreMin || item.aggregatedScore >= Number(filters.scoreMin);

		return matchesQuery && matchesRegion && matchesBucket && matchesActive && matchesStack && matchesScore;
	});

	switch (filters.sort) {
		case 'name_asc':
			output = output.sort((left, right) => left.name.localeCompare(right.name));
			break;
		case 'last_activity_desc':
			output = output.sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt));
			break;
		case 'relevance':
			output = output.sort((left, right) => {
				const leftMatch = query && left.name.toLowerCase().startsWith(query) ? 1 : 0;
				const rightMatch = query && right.name.toLowerCase().startsWith(query) ? 1 : 0;
				if (leftMatch !== rightMatch) {
					return rightMatch - leftMatch;
				}
				return right.aggregatedScore - left.aggregatedScore;
			});
			break;
		case 'score_desc':
		default:
			output = output.sort((left, right) => right.aggregatedScore - left.aggregatedScore);
	}

	return output;
}

export function getScoringConfig(): ScoringConfig {
	return structuredClone(activeScoringConfig);
}

export function getDefaultScoringConfig(): ScoringConfig {
	return structuredClone(defaultScoringConfig);
}

export function validateScoringConfig(config: ScoringConfig): ScoringConfigValidation {
	const enabledSourceCount = Object.values(config.sources).filter((source) => source.enabled).length;
	const weights = Object.values(config.weights);
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
	const errors: string[] = [];

	if (enabledSourceCount === 0) {
		errors.push('Enable at least one data source.');
	}

	if (!weights.every((weight) => Number.isFinite(weight) && weight >= 0 && weight <= 100)) {
		errors.push('Weights must be numbers between 0 and 100.');
	}

	if (totalWeight !== 100) {
		errors.push('Weights must add up to exactly 100.');
	}

	return {
		isValid: errors.length === 0,
		errors,
		totalWeight,
		enabledSourceCount
	};
}

export function updateScoringConfig(next: Partial<ScoringConfig>): ScoringConfig {
	const candidate: ScoringConfig = {
		...activeScoringConfig,
		...next,
		sources: next.sources ? { ...activeScoringConfig.sources, ...next.sources } : activeScoringConfig.sources,
		weights: next.weights ? { ...activeScoringConfig.weights, ...next.weights } : activeScoringConfig.weights,
		normalization: next.normalization
			? { ...activeScoringConfig.normalization, ...next.normalization }
			: activeScoringConfig.normalization,
		updatedAt: new Date().toISOString()
	};

	const validation = validateScoringConfig(candidate);
	if (!validation.isValid) {
		throw new Error(validation.errors.join(' '));
	}

	activeScoringConfig = candidate;
	return getScoringConfig();
}

export function getAdminScorePreview(config = activeScoringConfig): TeamListItem[] {
	return teamsSeed
		.map((team) => toTeamListItem(team, config))
		.sort((left, right) => right.aggregatedScore - left.aggregatedScore);
}

export function listTeams(filters: TeamFilterState): TeamSearchResponse {
	const items = teamsSeed.map((team) => toTeamListItem(team, activeScoringConfig));
	const filtered = applyTeamFilters(items, filters);
	const start = (filters.page - 1) * filters.pageSize;
	const paged = filtered.slice(start, start + filters.pageSize);

	return {
		items: paged,
		total: filtered.length,
		page: filters.page,
		pageSize: filters.pageSize,
		suggestions: searchSuggestions(filters.q),
		availableRegions: regionOptions,
		availableStacks: stackOptions
	};
}

export function parseTeamFilters(params: URLSearchParams): TeamFilterState {
	const page = Number(params.get('page') ?? '1');
	const pageSize = Number(params.get('page_size') ?? '20');
	const sort = (params.get('sort') ?? 'score_desc') as TeamSortOption;

	return {
		q: params.get('q') ?? '',
		region: params.get('region') ?? '',
		sizeBucket: params.get('size_bucket') ?? '',
		active: params.get('active') ?? '',
		stack: params.get('stack') ?? '',
		scoreMin: params.get('score_min') ?? '',
		sort,
		page: Number.isFinite(page) && page > 0 ? page : 1,
		pageSize: Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20
	};
}

export function getTeamDetail(teamId: string): TeamDetail | undefined {
	const team = teamMap.get(teamId);
	if (!team) {
		return undefined;
	}

	const listItem = toTeamListItem(team, activeScoringConfig);
	return {
		...listItem,
		scoreBreakdown: teamBreakdown(team, activeScoringConfig),
		metrics: {
			prThroughput30d: team.metricsSeed.bitbucketThroughput + team.metricsSeed.githubThroughput,
			prReviewTimeHours: team.metricsSeed.reviewTimeHours,
			mergeRate: Number((team.metricsSeed.mergeRate * 100).toFixed(1)),
			deploymentFrequency30d: team.metricsSeed.deploymentFrequency30d,
			prodBuildSuccessRate: Number((team.metricsSeed.prodBuildSuccessRate * 100).toFixed(1)),
			mttrHours30d: team.metricsSeed.mttrHours30d,
			productionDefects30d: team.metricsSeed.productionDefects30d,
			hotfixCount30d: team.metricsSeed.hotfixCount30d,
			gcpChanges30d: team.metricsSeed.gcpChanges30d,
			gcpIncidents30d: team.metricsSeed.gcpIncidents30d
		},
		members: team.members.map((member) => toMemberListItem(team, member)),
		alerts: [...alerts, ...team.alerts]
	};
}

export function getTeamRoster(teamId = 'team-alpha'): EmployeeSummary[] {
	return [...(teamMap.get(teamId)?.members ?? [])];
}

export function getEmployeeDetail(id: string): EmployeeDetail | undefined {
	return detailMap.get(id);
}

export function getAllEmployeeListItems(): TeamMemberListItem[] {
	return teamsSeed.flatMap((team) => team.members.map((member) => toMemberListItem(team, member)));
}

export function getTeamSearchTypeahead(query: string): TeamSearchResponse['suggestions'] {
	return searchSuggestions(query);
}

export const defaultTeamFilterState: TeamFilterState = {
	q: '',
	region: '',
	sizeBucket: '',
	active: '',
	stack: '',
	scoreMin: '',
	sort: 'score_desc',
	page: 1,
	pageSize: 20
};
