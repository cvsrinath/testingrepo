import PeriodSelector from '$lib/components/PeriodSelector.svelte';
import { fireEvent, render } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { afterEach, describe, expect, it } from 'vitest';
import { resetPeriod, selectedPeriod } from './period';

describe('period store propagation', () => {
	afterEach(() => {
		resetPeriod();
	});

	it('updates selected period from selector interaction', async () => {
		const { getByLabelText } = render(PeriodSelector);
		const selector = getByLabelText('Review period') as HTMLSelectElement;
		await fireEvent.change(selector, { target: { value: 'Q' } });
		expect(get(selectedPeriod)).toBe('Q');
	});
});
