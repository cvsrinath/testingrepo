import type { EmployeeSummary } from '$lib/types/kyp';

const headers = [
	'Employee',
	'Role',
	'Composite',
	'Commits/Wk',
	'PR Throughput',
	'Review Engagement',
	'Impact',
	'Code Quality'
];

function escapeCell(value: string | number): string {
	const stringValue = String(value);
	const escaped = stringValue.replaceAll('"', '""');
	return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}

export function teamRowsToCsv(rows: EmployeeSummary[]): string {
	const bodyRows = rows.map((row) =>
		[
			row.displayName,
			row.roleLevel,
			row.compositeScore,
			row.commitsPerWeek,
			row.prThroughput,
			row.reviewEngagement,
			row.impactScore,
			row.codeQualityScore
		]
			.map(escapeCell)
			.join(',')
	);

	return [headers.join(','), ...bodyRows].join('\n');
}

export function downloadCsv(csvContent: string, filename: string): void {
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
