/// <reference types="node" />
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		// Guard: svelteTesting() imports vitest APIs at init time. Including it
		// unconditionally causes vitest v4 to complain "runner not found" when
		// the plugin is loaded by the Vite dev/build pipeline instead of the
		// vitest runner. VITEST env var is set by vitest before config load.
		...(process.env.VITEST ? [svelteTesting()] : [])
	],
	test: {
		environment: 'jsdom',
		setupFiles: ['src/test/setup.ts'],
		include: ['src/**/*.{test,spec}.{ts,js}']
	}
});
