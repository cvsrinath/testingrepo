import { json } from '@sveltejs/kit';
import { getTeamDetail } from '$lib/mock/kypData';

export function GET({ params, url }) {
	const detail = getTeamDetail(params.teamId);
	if (!detail) {
		return json({ message: 'Team not found' }, { status: 404 });
	}

	const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
	const role = url.searchParams.get('role') ?? '';
	const status = url.searchParams.get('status') ?? '';

	const items = detail.members.filter((member) => {
		const matchesQuery = q.length === 0 || member.displayName.toLowerCase().includes(q);
		const matchesRole = role.length === 0 || member.roleLevel === role;
		const matchesStatus = status.length === 0 || member.status === status;
		return matchesQuery && matchesRole && matchesStatus;
	});

	return json({ items, total: items.length });
}
