import type { EmployeeTrainingProfile, ManagerTrainingView, TrainingCategory, TrainingCourse, TrainingDashboardStats } from '$lib/types/training';
import { teams } from '$lib/mock/shared/employees';
import { courses, trainingProfiles } from './seed';

export function getTrainingDashboard(): TrainingDashboardStats {
	const now = '2026-06-15';

	const totalCourses = courses.length;
	const allTrainings = trainingProfiles.flatMap((p) => p.trainings);
	const completed = allTrainings.filter((t) => t.status === 'completed').length;
	const overallCompletionRate = allTrainings.length === 0 ? 0 : Math.round((completed / allTrainings.length) * 100);
	const overdueTrainings = allTrainings.filter((t) => t.status === 'overdue').length;

	const upcomingDeadlines = trainingProfiles.flatMap((p) =>
		p.trainings
			.filter((t) => t.dueDate && t.dueDate > now && t.status !== 'completed')
			.map((t) => ({ person: p.person, course: t.course, dueDate: t.dueDate! }))
	).sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 8);

	const expiringCertifications = trainingProfiles.flatMap((p) =>
		p.certifications
			.filter((c) => c.status === 'expiring_soon')
			.map((c) => ({ person: p.person, certification: c }))
	).slice(0, 5);

	const cats: TrainingCategory[] = ['security', 'compliance', 'technical', 'leadership', 'onboarding', 'certification'];
	const completionByCategory = cats.map((category) => {
		const catTrainings = allTrainings.filter((t) => t.course.category === category);
		const rate = catTrainings.length === 0 ? 0 : Math.round((catTrainings.filter((t) => t.status === 'completed').length / catTrainings.length) * 100);
		return { category, rate };
	});

	const completionByTeam = teams.map((team) => {
		const teamProfiles = trainingProfiles.filter((p) => p.team.id === team.id);
		const teamTrainings = teamProfiles.flatMap((p) => p.trainings);
		const rate = teamTrainings.length === 0 ? 0 : Math.round((teamTrainings.filter((t) => t.status === 'completed').length / teamTrainings.length) * 100);
		const overdueCount = teamTrainings.filter((t) => t.status === 'overdue').length;
		return { team, rate, overdueCount };
	});

	return { totalCourses, overallCompletionRate, overdueTrainings, upcomingDeadlines, expiringCertifications, completionByCategory, completionByTeam };
}

export function listCourses(filters?: { category?: string; difficulty?: string; required?: string; q?: string }): TrainingCourse[] {
	let result = [...courses];
	if (filters?.category) result = result.filter((c) => c.category === filters.category);
	if (filters?.difficulty) result = result.filter((c) => c.difficulty === filters.difficulty);
	if (filters?.required === 'true') result = result.filter((c) => c.required);
	if (filters?.required === 'false') result = result.filter((c) => !c.required);
	if (filters?.q) {
		const q = filters.q.toLowerCase();
		result = result.filter((c) => c.title.toLowerCase().includes(q) || c.tags.some((t) => t.includes(q)));
	}
	return result;
}

export function getCourse(id: string): TrainingCourse | undefined {
	return courses.find((c) => c.id === id);
}

export function listEmployeeProfiles(filters?: { team?: string; q?: string }): EmployeeTrainingProfile[] {
	let result = [...trainingProfiles];
	if (filters?.team) result = result.filter((p) => p.team.id === filters.team);
	if (filters?.q) {
		const q = filters.q.toLowerCase();
		result = result.filter((p) => p.person.name.toLowerCase().includes(q));
	}
	return result;
}

export function getEmployeeTrainingProfile(id: string): EmployeeTrainingProfile | undefined {
	return trainingProfiles.find((p) => p.person.id === id);
}

export function getManagerView(teamId: string): ManagerTrainingView {
	const team = teams.find((t) => t.id === teamId) ?? { id: teamId, name: teamId };
	const teamProfiles = trainingProfiles.filter((p) => p.team.id === teamId);
	const now = '2026-06-15';

	const members = teamProfiles.map((p) => ({
		person: p.person,
		completionRate: p.completionRate,
		overdueCount: p.overdueCount,
		upcomingDeadlines: p.trainings.filter((t) => t.dueDate && t.dueDate > now && t.status !== 'completed').length,
		expiringCerts: p.certifications.filter((c) => c.status === 'expiring_soon').length,
	}));

	const teamTrainings = teamProfiles.flatMap((p) => p.trainings);
	const teamCompletionRate = teamTrainings.length === 0 ? 0 : Math.round((teamTrainings.filter((t) => t.status === 'completed').length / teamTrainings.length) * 100);

	const requiredCourses = courses.filter((c) => c.required);
	const trainingGaps = requiredCourses.map((course) => ({
		course,
		missingCount: teamProfiles.filter((p) => !p.trainings.some((t) => t.courseId === course.id && t.status === 'completed')).length,
	})).filter((g) => g.missingCount > 0);

	return { team, members, teamCompletionRate, trainingGaps };
}
