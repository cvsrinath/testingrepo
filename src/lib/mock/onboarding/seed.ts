import type { Person } from '$lib/types/shared';
import type { OnboardingEmployee, OnboardingStatus, OnboardingTask, OnboardingTemplate, TaskCategory, TaskStatus } from '$lib/types/onboarding';
import { employees, teams } from '$lib/mock/shared/employees';

const managers: Person[] = [
	{ id: 'mgr-alpha', name: 'Pat Sullivan', email: 'pat.sullivan@company.com', role: 'Engineering Manager', team: 'team-alpha' },
	{ id: 'mgr-beacon', name: 'Sam Chen', email: 'sam.chen@company.com', role: 'Engineering Manager', team: 'team-beacon' },
	{ id: 'mgr-cirrus', name: 'Chris Park', email: 'chris.park@company.com', role: 'Engineering Manager', team: 'team-cirrus' },
	{ id: 'mgr-delta', name: 'Jordan Mills', email: 'jordan.mills@company.com', role: 'Engineering Manager', team: 'team-delta' },
];

function toTaskStatus(s: OnboardingStatus): TaskStatus {
	if (s === 'not_started') return 'pending';
	return s as TaskStatus;
}

function makeTask(id: string, title: string, category: TaskCategory, status: TaskStatus, opts: Partial<OnboardingTask> = {}): OnboardingTask {
	return { id, title, category, status, ...opts };
}

const commonTasks = (prefix: string, ovStatus: OnboardingStatus): OnboardingTask[] => {
	const status = toTaskStatus(ovStatus);
	return [
		makeTask(`${prefix}-hw-1`, 'Laptop provisioned and delivered', 'hardware', status, { assignedTo: 'IT Support', dueDate: '2026-06-20' }),
		makeTask(`${prefix}-hw-2`, 'Monitor and peripherals setup', 'hardware', status, { assignedTo: 'IT Support' }),
		makeTask(`${prefix}-acc-1`, 'Corporate email account created', 'accounts', status, { assignedTo: 'IT Support', dueDate: '2026-06-18' }),
		makeTask(`${prefix}-acc-2`, 'Slack workspace invitation sent', 'accounts', status, { assignedTo: 'HR' }),
		makeTask(`${prefix}-acc-3`, 'Jira and Confluence access granted', 'accounts', status, { assignedTo: 'IT Support' }),
		makeTask(`${prefix}-acc-4`, 'GitHub/GitLab access provisioned', 'access', status, { assignedTo: 'IT Support', dueDate: '2026-06-20' }),
		makeTask(`${prefix}-acc-5`, 'VPN credentials issued', 'access', status, { assignedTo: 'IT Support' }),
		makeTask(`${prefix}-hr-1`, 'HR onboarding paperwork completed', 'hr', ovStatus === 'not_started' ? 'completed' : status, { completedDate: '2026-06-10' }),
		makeTask(`${prefix}-hr-2`, 'Benefits enrollment submitted', 'hr', status, { dueDate: '2026-07-01' }),
		makeTask(`${prefix}-or-1`, 'Company orientation attended', 'orientation', status, { dueDate: '2026-06-22' }),
		makeTask(`${prefix}-or-2`, 'Engineering all-hands introduced', 'orientation', status),
	];
};

const alphaSpecific = (prefix: string, ovStatus: OnboardingStatus): OnboardingTask[] => {
	const status = toTaskStatus(ovStatus);
	return [
		makeTask(`${prefix}-ts-1`, 'Kubernetes cluster access granted', 'team_specific', status, { assignedTo: 'Team Alpha Lead' }),
		makeTask(`${prefix}-ts-2`, 'GCP project permissions configured', 'team_specific', status, { assignedTo: 'Team Alpha Lead' }),
		makeTask(`${prefix}-ts-3`, 'CI/CD pipeline walkthrough completed', 'team_specific', status),
	];
};

const beaconSpecific = (prefix: string, ovStatus: OnboardingStatus): OnboardingTask[] => {
	const status = toTaskStatus(ovStatus);
	return [
		makeTask(`${prefix}-ts-1`, 'Design tools (Figma) access granted', 'team_specific', status, { assignedTo: 'Team Beacon Lead' }),
		makeTask(`${prefix}-ts-2`, 'Storybook local setup completed', 'team_specific', status),
		makeTask(`${prefix}-ts-3`, 'Frontend stack walkthrough', 'team_specific', status),
	];
};

const cirrusSpecific = (prefix: string, ovStatus: OnboardingStatus): OnboardingTask[] => {
	const status = toTaskStatus(ovStatus);
	return [
		makeTask(`${prefix}-ts-1`, 'Data warehouse access provisioned', 'team_specific', status, { assignedTo: 'Team Cirrus Lead' }),
		makeTask(`${prefix}-ts-2`, 'Analytics tools setup (Looker/dbt)', 'team_specific', status),
		makeTask(`${prefix}-ts-3`, 'Data pipeline overview completed', 'team_specific', status),
	];
};

const deltaSpecific = (prefix: string, ovStatus: OnboardingStatus): OnboardingTask[] => {
	const status = toTaskStatus(ovStatus);
	return [
		makeTask(`${prefix}-ts-1`, 'Platform service accounts created', 'team_specific', status, { assignedTo: 'Team Delta Lead' }),
		makeTask(`${prefix}-ts-2`, 'API gateway access configured', 'team_specific', status),
		makeTask(`${prefix}-ts-3`, 'Platform architecture review completed', 'team_specific', status),
	];
};

function calcCompletion(tasks: OnboardingTask[], teamTasks: OnboardingTask[]): number {
	const all = [...tasks, ...teamTasks];
	const done = all.filter((t) => t.status === 'completed' || t.status === 'approved').length;
	return all.length === 0 ? 0 : Math.round((done / all.length) * 100);
}

const newHires: Person[] = [
	{ id: 'nh-01', name: 'Sam Rivera', email: 'sam.rivera@company.com', role: 'Engineer', team: 'team-alpha' },
	{ id: 'nh-02', name: 'Priya Kapoor', email: 'priya.kapoor@company.com', role: 'Senior Engineer', team: 'team-beacon' },
	{ id: 'nh-03', name: 'Marco Bell', email: 'marco.bell@company.com', role: 'Engineer', team: 'team-cirrus' },
	{ id: 'nh-04', name: 'Lily Zhang', email: 'lily.zhang@company.com', role: 'Engineer', team: 'team-alpha' },
	{ id: 'nh-05', name: 'Ethan Brooks', email: 'ethan.brooks@company.com', role: 'Senior Engineer', team: 'team-delta' },
	{ id: 'nh-06', name: 'Sofia Torres', email: 'sofia.torres@company.com', role: 'Intern', team: 'team-beacon' },
	{ id: 'nh-07', name: 'Liam Foster', email: 'liam.foster@company.com', role: 'Engineer', team: 'team-cirrus' },
	{ id: 'nh-08', name: 'Aisha Okonkwo', email: 'aisha.okonkwo@company.com', role: 'Staff Engineer', team: 'team-delta' },
	{ id: 'nh-09', name: 'Carlos Mendez', email: 'carlos.mendez@company.com', role: 'Engineer', team: 'team-alpha' },
];

export const onboardingEmployees: OnboardingEmployee[] = [
	{
		person: newHires[0],
		startDate: '2026-06-16',
		manager: managers[0],
		team: teams[0],
		location: 'New York, NY',
		employmentType: 'full_time',
		status: 'in_progress',
		tasks: commonTasks('nh01', 'in_progress'),
		teamSpecificTasks: alphaSpecific('nh01', 'not_started'),
		completionPercent: 0,
	},
	{
		person: newHires[1],
		startDate: '2026-06-09',
		manager: managers[1],
		team: teams[1],
		location: 'Austin, TX',
		employmentType: 'full_time',
		status: 'in_progress',
		tasks: commonTasks('nh02', 'completed'),
		teamSpecificTasks: beaconSpecific('nh02', 'in_progress'),
		completionPercent: 0,
	},
	{
		person: newHires[2],
		startDate: '2026-06-02',
		manager: managers[2],
		team: teams[2],
		location: 'Remote',
		employmentType: 'full_time',
		status: 'blocked',
		tasks: (() => {
			const tasks = commonTasks('nh03', 'in_progress');
			tasks[3] = { ...tasks[3], status: 'blocked', blockedReason: 'Waiting on IT provisioning approval' };
			return tasks;
		})(),
		teamSpecificTasks: cirrusSpecific('nh03', 'not_started'),
		completionPercent: 0,
	},
	{
		person: newHires[3],
		startDate: '2026-06-23',
		manager: managers[0],
		team: teams[0],
		location: 'San Francisco, CA',
		employmentType: 'full_time',
		status: 'not_started',
		tasks: commonTasks('nh04', 'not_started'),
		teamSpecificTasks: alphaSpecific('nh04', 'not_started'),
		completionPercent: 0,
	},
	{
		person: newHires[4],
		startDate: '2026-05-26',
		manager: managers[3],
		team: teams[3],
		location: 'Chicago, IL',
		employmentType: 'full_time',
		status: 'completed',
		tasks: commonTasks('nh05', 'completed'),
		teamSpecificTasks: deltaSpecific('nh05', 'completed'),
		completionPercent: 0,
	},
	{
		person: newHires[5],
		startDate: '2026-06-16',
		manager: managers[1],
		team: teams[1],
		location: 'Remote',
		employmentType: 'intern',
		status: 'in_progress',
		tasks: commonTasks('nh06', 'in_progress'),
		teamSpecificTasks: beaconSpecific('nh06', 'not_started'),
		completionPercent: 0,
	},
	{
		person: newHires[6],
		startDate: '2026-06-09',
		manager: managers[2],
		team: teams[2],
		location: 'Seattle, WA',
		employmentType: 'full_time',
		status: 'in_progress',
		tasks: commonTasks('nh07', 'in_progress'),
		teamSpecificTasks: cirrusSpecific('nh07', 'in_progress'),
		completionPercent: 0,
	},
	{
		person: newHires[7],
		startDate: '2026-06-30',
		manager: managers[3],
		team: teams[3],
		location: 'Boston, MA',
		employmentType: 'full_time',
		status: 'not_started',
		tasks: commonTasks('nh08', 'not_started'),
		teamSpecificTasks: deltaSpecific('nh08', 'not_started'),
		completionPercent: 0,
	},
	{
		person: newHires[8],
		startDate: '2026-06-02',
		manager: managers[0],
		team: teams[0],
		location: 'New York, NY',
		employmentType: 'contract',
		status: 'in_progress',
		tasks: commonTasks('nh09', 'in_progress'),
		teamSpecificTasks: alphaSpecific('nh09', 'completed'),
		completionPercent: 0,
	},
];

for (const emp of onboardingEmployees) {
	emp.completionPercent = calcCompletion(emp.tasks, emp.teamSpecificTasks);
}

export const onboardingTemplates: OnboardingTemplate[] = [
	{
		teamId: 'team-alpha',
		teamName: 'Team Alpha',
		tasks: [
			{ title: 'Kubernetes cluster access granted', category: 'team_specific', assignedTo: 'Team Alpha Lead', dueDate: undefined },
			{ title: 'GCP project permissions configured', category: 'team_specific', assignedTo: 'Team Alpha Lead' },
			{ title: 'CI/CD pipeline walkthrough completed', category: 'team_specific' },
			{ title: 'Internal services runbook reviewed', category: 'team_specific' },
		],
	},
	{
		teamId: 'team-beacon',
		teamName: 'Team Beacon',
		tasks: [
			{ title: 'Design tools (Figma) access granted', category: 'team_specific', assignedTo: 'Team Beacon Lead' },
			{ title: 'Storybook local setup completed', category: 'team_specific' },
			{ title: 'Frontend stack walkthrough', category: 'team_specific' },
			{ title: 'Component library review', category: 'team_specific' },
		],
	},
	{
		teamId: 'team-cirrus',
		teamName: 'Team Cirrus',
		tasks: [
			{ title: 'Data warehouse access provisioned', category: 'team_specific', assignedTo: 'Team Cirrus Lead' },
			{ title: 'Analytics tools setup (Looker/dbt)', category: 'team_specific' },
			{ title: 'Data pipeline overview completed', category: 'team_specific' },
			{ title: 'Data governance policies reviewed', category: 'team_specific' },
		],
	},
	{
		teamId: 'team-delta',
		teamName: 'Team Delta',
		tasks: [
			{ title: 'Platform service accounts created', category: 'team_specific', assignedTo: 'Team Delta Lead' },
			{ title: 'API gateway access configured', category: 'team_specific' },
			{ title: 'Platform architecture review completed', category: 'team_specific' },
			{ title: 'On-call rotation introduction', category: 'team_specific' },
		],
	},
];
