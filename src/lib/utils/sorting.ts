import type { EmployeeSummary, SortDirection, SortableMetric } from '$lib/types/kyp';

export function sortTeamMembers(
	rows: EmployeeSummary[],
	key: SortableMetric,
	direction: SortDirection
): EmployeeSummary[] {
	const sorted = [...rows].sort((a, b) => {
		const left = a[key];
		const right = b[key];
		return left === right ? a.displayName.localeCompare(b.displayName) : left - right;
	});

	return direction === 'asc' ? sorted : sorted.reverse();
}

export function nextSortDirection(current: SortDirection): SortDirection {
	return current === 'asc' ? 'desc' : 'asc';
}
