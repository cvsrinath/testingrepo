<script lang="ts">
	type Variant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

	interface Props {
		status: string;
		variant?: Variant;
	}

	const autoVariantMap: Record<string, Variant> = {
		completed: 'success',
		active: 'success',
		approved: 'success',
		in_progress: 'info',
		pending: 'neutral',
		not_started: 'neutral',
		blocked: 'danger',
		overdue: 'danger',
		expired: 'danger',
		warning: 'warning',
		expiring_soon: 'warning',
		inactive: 'neutral',
	};

	let { status, variant }: Props = $props();

	const resolvedVariant = $derived(variant ?? autoVariantMap[status] ?? 'neutral');
	const label = $derived(status.replace(/_/g, ' '));
</script>

<span class="badge badge--{resolvedVariant}">{label}</span>

<style>
	.badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: capitalize;
		letter-spacing: 0.03em;
		white-space: nowrap;
	}

	.badge--success { background: #dcfce7; color: #166534; }
	.badge--info { background: var(--accent-soft); color: var(--accent); }
	.badge--warning { background: #fef9c3; color: #854d0e; }
	.badge--danger { background: #fee2e2; color: #991b1b; }
	.badge--neutral { background: var(--surface-muted); color: var(--muted); }
</style>
