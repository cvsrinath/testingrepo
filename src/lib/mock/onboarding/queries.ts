import type { OnboardingDashboardStats, OnboardingEmployee, OnboardingTemplate, TaskStatus } from '$lib/types/onboarding';
import { onboardingEmployees, onboardingTemplates } from './seed';

export function getOnboardingDashboard(): OnboardingDashboardStats {
	const now = new Date('2026-06-15');
	const monthStart = new Date('2026-06-01');

	const newHiresThisMonth = onboardingEmployees.filter((e) => new Date(e.startDate) >= monthStart).length;
	const activeOnboardings = onboardingEmployees.filter((e) => e.status === 'in_progress').length;
	const completedThisMonth = onboardingEmployees.filter(
		(e) => e.status === 'completed' && new Date(e.startDate) >= monthStart
	).length;

	const allTasks = onboardingEmployees.flatMap((e) => [...e.tasks, ...e.teamSpecificTasks]);
	const blockedTasks = allTasks.filter((t) => t.status === 'blocked').length;

	const averageCompletionPercent = onboardingEmployees.length === 0
		? 0
		: Math.round(onboardingEmployees.reduce((s, e) => s + e.completionPercent, 0) / onboardingEmployees.length);

	const upcomingStartDates = onboardingEmployees
		.filter((e) => new Date(e.startDate) > now && e.status !== 'completed')
		.sort((a, b) => a.startDate.localeCompare(b.startDate))
		.slice(0, 5)
		.map((e) => ({ person: e.person, startDate: e.startDate, team: e.team }));

	const delayedTasks = onboardingEmployees.flatMap((e) =>
		[...e.tasks, ...e.teamSpecificTasks]
			.filter((t) => t.status === 'blocked' || (t.dueDate && new Date(t.dueDate) < now && t.status !== 'completed' && t.status !== 'approved'))
			.map((task) => ({ task, employee: e.person }))
	).slice(0, 10);

	return { newHiresThisMonth, activeOnboardings, completedThisMonth, blockedTasks, averageCompletionPercent, upcomingStartDates, delayedTasks };
}

export function listOnboardingEmployees(filters?: { status?: string; team?: string; q?: string }): OnboardingEmployee[] {
	let result = [...onboardingEmployees];
	if (filters?.status) result = result.filter((e) => e.status === filters.status);
	if (filters?.team) result = result.filter((e) => e.team.id === filters.team);
	if (filters?.q) {
		const q = filters.q.toLowerCase();
		result = result.filter((e) => e.person.name.toLowerCase().includes(q));
	}
	return result;
}

export function getOnboardingEmployee(id: string): OnboardingEmployee | undefined {
	return onboardingEmployees.find((e) => e.person.id === id);
}

export function getOnboardingTemplates(): OnboardingTemplate[] {
	return onboardingTemplates;
}

export function getOnboardingTemplate(teamId: string): OnboardingTemplate | undefined {
	return onboardingTemplates.find((t) => t.teamId === teamId);
}

export function updateTaskStatus(employeeId: string, taskId: string, status: TaskStatus): void {
	const emp = onboardingEmployees.find((e) => e.person.id === employeeId);
	if (!emp) return;
	const task = [...emp.tasks, ...emp.teamSpecificTasks].find((t) => t.id === taskId);
	if (task) {
		task.status = status;
		if (status === 'completed' || status === 'approved') task.completedDate = new Date().toISOString().slice(0, 10);
	}
	const all = [...emp.tasks, ...emp.teamSpecificTasks];
	const done = all.filter((t) => t.status === 'completed' || t.status === 'approved').length;
	emp.completionPercent = all.length === 0 ? 0 : Math.round((done / all.length) * 100);
}
