import type { Person, TeamRef } from './shared';

export type TrainingStatus = 'not_started' | 'in_progress' | 'completed' | 'expired' | 'overdue';
export type TrainingCategory = 'security' | 'compliance' | 'technical' | 'leadership' | 'onboarding' | 'certification';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface TrainingCourse {
	id: string;
	title: string;
	category: TrainingCategory;
	description: string;
	duration: string;
	difficulty: Difficulty;
	provider: string;
	required: boolean;
	tags: string[];
	recommendedFor: { roles: string[]; teams: string[]; tracks: string[] };
}

export interface EmployeeTraining {
	courseId: string;
	course: TrainingCourse;
	status: TrainingStatus;
	assignedDate: string;
	dueDate?: string;
	completedDate?: string;
	expiryDate?: string;
	score?: number;
}

export interface EmployeeTrainingProfile {
	person: Person;
	team: TeamRef;
	trainings: EmployeeTraining[];
	certifications: Certification[];
	completionRate: number;
	overdueCount: number;
	recommendedCourses: TrainingCourse[];
}

export interface Certification {
	id: string;
	name: string;
	issuer: string;
	earnedDate: string;
	expiryDate?: string;
	status: 'active' | 'expired' | 'expiring_soon';
}

export interface TrainingDashboardStats {
	totalCourses: number;
	overallCompletionRate: number;
	overdueTrainings: number;
	upcomingDeadlines: { person: Person; course: TrainingCourse; dueDate: string }[];
	expiringCertifications: { person: Person; certification: Certification }[];
	completionByCategory: { category: TrainingCategory; rate: number }[];
	completionByTeam: { team: TeamRef; rate: number; overdueCount: number }[];
}

export interface ManagerTrainingView {
	team: TeamRef;
	members: {
		person: Person;
		completionRate: number;
		overdueCount: number;
		upcomingDeadlines: number;
		expiringCerts: number;
	}[];
	teamCompletionRate: number;
	trainingGaps: { course: TrainingCourse; missingCount: number }[];
}
