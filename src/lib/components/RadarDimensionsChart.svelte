<script lang="ts">
	import type { DimensionScore } from '$lib/types/kyp';

	interface Props {
		dimensions: DimensionScore[];
	}

	let { dimensions }: Props = $props();

	const radius = 120;
	const center = 140;

	function pointFor(index: number, total: number, value: number): string {
		const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
		const scale = (value / 100) * radius;
		const x = center + Math.cos(angle) * scale;
		const y = center + Math.sin(angle) * scale;
		return `${x},${y}`;
	}

	const polygonPoints = $derived(
		dimensions.map((dimension, idx) => pointFor(idx, dimensions.length, dimension.score)).join(' ')
	);

	const labelPoints = $derived(
		dimensions.map((dimension, idx) => {
			const angle = (Math.PI * 2 * idx) / dimensions.length - Math.PI / 2;
			const x = center + Math.cos(angle) * (radius + 22);
			const y = center + Math.sin(angle) * (radius + 22);
			return { ...dimension, x, y };
		})
	);
</script>

<article class="panel radar" data-testid="radar-chart">
	<h3>Dimension Radar</h3>
	<svg viewBox="0 0 280 280" role="img" aria-label="Five-dimension radar chart">
		{#each [0.2, 0.4, 0.6, 0.8, 1] as ring}
			<circle cx={center} cy={center} r={radius * ring} class="ring" />
		{/each}

		{#each dimensions as dimension, idx}
			{@const axisAngle = (Math.PI * 2 * idx) / dimensions.length - Math.PI / 2}
			<line
				x1={center}
				y1={center}
				x2={center + Math.cos(axisAngle) * radius}
				y2={center + Math.sin(axisAngle) * radius}
				class="axis"
			/>
		{/each}

		<polygon points={polygonPoints} class="shape" />

		{#each labelPoints as label}
			<text x={label.x} y={label.y} text-anchor="middle">{label.dimension}</text>
		{/each}
	</svg>
</article>

<style>
	.radar h3 {
		margin-top: 0;
	}

	svg {
		width: 100%;
		max-width: 22rem;
		display: block;
		margin: 0 auto;
	}

	.ring,
	.axis {
		fill: none;
		stroke: var(--border);
		stroke-width: 1;
	}

	.shape {
		fill: rgba(31, 111, 91, 0.35);
		stroke: var(--accent-strong);
		stroke-width: 2;
	}

	text {
		font-size: 0.55rem;
		fill: var(--muted);
		font-weight: 700;
	}
</style>
