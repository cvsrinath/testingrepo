import type { Person, TeamRef } from '$lib/types/shared';

export const teams: TeamRef[] = [
	{ id: 'team-alpha', name: 'Team Alpha' },
	{ id: 'team-beacon', name: 'Team Beacon' },
	{ id: 'team-cirrus', name: 'Team Cirrus' },
	{ id: 'team-delta', name: 'Team Delta' },
];

export const employees: Person[] = [
	{ id: 'alex-rivera', name: 'Alex Rivera', email: 'alex.rivera@company.com', role: 'Senior Engineer', team: 'team-alpha' },
	{ id: 'maria-owens', name: 'Maria Owens', email: 'maria.owens@company.com', role: 'Staff Engineer', team: 'team-alpha' },
	{ id: 'jordan-lee', name: 'Jordan Lee', email: 'jordan.lee@company.com', role: 'Engineer', team: 'team-alpha' },
	{ id: 'casey-kim', name: 'Casey Kim', email: 'casey.kim@company.com', role: 'Senior Engineer', team: 'team-alpha' },
	{ id: 'taylor-brooks', name: 'Taylor Brooks', email: 'taylor.brooks@company.com', role: 'Engineer', team: 'team-beacon' },
	{ id: 'morgan-chen', name: 'Morgan Chen', email: 'morgan.chen@company.com', role: 'Staff Engineer', team: 'team-beacon' },
	{ id: 'riley-patel', name: 'Riley Patel', email: 'riley.patel@company.com', role: 'Senior Engineer', team: 'team-beacon' },
	{ id: 'avery-santos', name: 'Avery Santos', email: 'avery.santos@company.com', role: 'Engineer', team: 'team-beacon' },
	{ id: 'drew-nguyen', name: 'Drew Nguyen', email: 'drew.nguyen@company.com', role: 'Senior Engineer', team: 'team-cirrus' },
	{ id: 'quinn-harris', name: 'Quinn Harris', email: 'quinn.harris@company.com', role: 'Engineer', team: 'team-cirrus' },
	{ id: 'sage-walker', name: 'Sage Walker', email: 'sage.walker@company.com', role: 'Staff Engineer', team: 'team-cirrus' },
	{ id: 'blake-martin', name: 'Blake Martin', email: 'blake.martin@company.com', role: 'Engineer', team: 'team-cirrus' },
	{ id: 'reese-thompson', name: 'Reese Thompson', email: 'reese.thompson@company.com', role: 'Senior Engineer', team: 'team-delta' },
	{ id: 'cameron-white', name: 'Cameron White', email: 'cameron.white@company.com', role: 'Engineer', team: 'team-delta' },
	{ id: 'harper-jones', name: 'Harper Jones', email: 'harper.jones@company.com', role: 'Senior Engineer', team: 'team-delta' },
	{ id: 'skylar-davis', name: 'Skylar Davis', email: 'skylar.davis@company.com', role: 'Engineer', team: 'team-delta' },
];

export function getEmployee(id: string): Person | undefined {
	return employees.find((e) => e.id === id);
}

export function getTeamEmployees(teamId: string): Person[] {
	return employees.filter((e) => e.team === teamId);
}

export function getTeam(id: string): TeamRef | undefined {
	return teams.find((t) => t.id === id);
}
