import type { AssetType, Environment, InfraAsset, InfraDashboardStats, TeamInfrastructure } from '$lib/types/infrastructure';
import type { TeamRef } from '$lib/types/shared';
import { infraAssets } from './seed';
import { teams } from '$lib/mock/shared/employees';

export function getInfraDashboard(): InfraDashboardStats {
	const byTypeMap = new Map<AssetType, number>();
	const byEnvMap = new Map<Environment, number>();

	for (const asset of infraAssets) {
		byTypeMap.set(asset.type, (byTypeMap.get(asset.type) ?? 0) + 1);
		byEnvMap.set(asset.environment, (byEnvMap.get(asset.environment) ?? 0) + 1);
	}

	const criticalSystems = infraAssets.filter((a) => a.criticality === 'critical');
	const recentlyUpdated = [...infraAssets].sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated)).slice(0, 5);

	return {
		totalAssets: infraAssets.length,
		byType: Array.from(byTypeMap.entries()).map(([type, count]) => ({ type, count })),
		byEnvironment: Array.from(byEnvMap.entries()).map(([environment, count]) => ({ environment, count })),
		criticalSystems,
		ownershipCoverage: 100,
		recentlyUpdated,
	};
}

export function listAssets(filters?: { type?: string; environment?: string; criticality?: string; ownerTeam?: string; q?: string }): InfraAsset[] {
	let result = [...infraAssets];
	if (filters?.type) result = result.filter((a) => a.type === filters.type);
	if (filters?.environment) result = result.filter((a) => a.environment === filters.environment);
	if (filters?.criticality) result = result.filter((a) => a.criticality === filters.criticality);
	if (filters?.ownerTeam) result = result.filter((a) => a.ownerTeam.id === filters.ownerTeam);
	if (filters?.q) {
		const q = filters.q.toLowerCase();
		result = result.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
	}
	return result;
}

export function getAsset(id: string): InfraAsset | undefined {
	return infraAssets.find((a) => a.id === id);
}

export function getTeamInfrastructure(teamId: string): TeamInfrastructure {
	const team = teams.find((t) => t.id === teamId) ?? { id: teamId, name: teamId };
	const ownedAssets = infraAssets.filter((a) => a.ownerTeam.id === teamId);
	const consumedAssets = infraAssets.filter((a) => a.ownerTeam.id !== teamId && a.consumedByTeams.some((t) => t.id === teamId));
	const sharedResources = infraAssets.filter((a) => a.environment === 'shared' && !ownedAssets.includes(a) && !consumedAssets.includes(a));
	return { team, ownedAssets, consumedAssets, sharedResources };
}

export function listTeamsInfra(): { team: TeamRef; ownedCount: number; consumedCount: number }[] {
	return teams.map((team) => ({
		team,
		ownedCount: infraAssets.filter((a) => a.ownerTeam.id === team.id).length,
		consumedCount: infraAssets.filter((a) => a.consumedByTeams.some((t) => t.id === team.id)).length,
	}));
}
