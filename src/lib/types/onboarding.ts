import type { Person, TeamRef } from './shared';

export type OnboardingStatus = 'not_started' | 'in_progress' | 'completed' | 'blocked';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'approved';
export type TaskCategory = 'hardware' | 'accounts' | 'access' | 'team_specific' | 'hr' | 'orientation';

export interface OnboardingTask {
	id: string;
	title: string;
	category: TaskCategory;
	status: TaskStatus;
	assignedTo?: string;
	dueDate?: string;
	completedDate?: string;
	notes?: string;
	blockedReason?: string;
}

export interface OnboardingEmployee {
	person: Person;
	startDate: string;
	manager: Person;
	team: TeamRef;
	location: string;
	employmentType: 'full_time' | 'contract' | 'intern';
	status: OnboardingStatus;
	completionPercent: number;
	tasks: OnboardingTask[];
	teamSpecificTasks: OnboardingTask[];
}

export interface OnboardingTemplate {
	teamId: string;
	teamName: string;
	tasks: Omit<OnboardingTask, 'id' | 'status' | 'completedDate'>[];
}

export interface OnboardingDashboardStats {
	newHiresThisMonth: number;
	activeOnboardings: number;
	completedThisMonth: number;
	blockedTasks: number;
	averageCompletionPercent: number;
	upcomingStartDates: { person: Person; startDate: string; team: TeamRef }[];
	delayedTasks: { task: OnboardingTask; employee: Person }[];
}
