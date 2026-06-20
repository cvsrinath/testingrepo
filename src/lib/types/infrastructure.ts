import type { TeamRef } from './shared';

export type AssetType = 'cloud_project' | 'kubernetes_cluster' | 'database' | 'repository' |
	'cicd_pipeline' | 'monitoring' | 'internal_service' | 'shared_platform';
export type Environment = 'production' | 'staging' | 'development' | 'shared';
export type Criticality = 'critical' | 'high' | 'medium' | 'low';

export interface InfraAsset {
	id: string;
	name: string;
	type: AssetType;
	description: string;
	environment: Environment;
	criticality: Criticality;
	ownerTeam: TeamRef;
	consumedByTeams: TeamRef[];
	dependencies: { assetId: string; assetName: string }[];
	tags: string[];
	createdAt: string;
	lastUpdated: string;
	url?: string;
}

export interface TeamInfrastructure {
	team: TeamRef;
	ownedAssets: InfraAsset[];
	consumedAssets: InfraAsset[];
	sharedResources: InfraAsset[];
}

export interface InfraDashboardStats {
	totalAssets: number;
	byType: { type: AssetType; count: number }[];
	byEnvironment: { environment: Environment; count: number }[];
	criticalSystems: InfraAsset[];
	ownershipCoverage: number;
	recentlyUpdated: InfraAsset[];
}
