import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import SupervisorPage from './+page.svelte';

function numericCardValue(text: string): number {
	const match = text.match(/(\d+(\.\d+)?)/);
	if (!match) {
		throw new Error(`No numeric value found in card text: ${text}`);
	}
	return Number(match[1]);
}

describe('Supervisor dashboard dropdown functionality', () => {
	it('updates period description and average composite when review period changes', async () => {
		const { getByLabelText, getByTestId } = render(SupervisorPage);

		const avgCard = getByTestId('avg-composite-card');
		const before = numericCardValue(avgCard.textContent ?? '');

		const periodSelect = getByLabelText('Review period') as HTMLSelectElement;
		await fireEvent.change(periodSelect, { target: { value: 'Q' } });

		const after = numericCardValue(avgCard.textContent ?? '');
		expect(after).not.toBe(before);
		expect(getByTestId('period-description').textContent).toContain('Quarter snapshot');
	});

	it('updates preset description and average composite when weight preset changes', async () => {
		const { getByLabelText, getByTestId } = render(SupervisorPage);

		const alexComposite = getByTestId('composite-alex-rivera');
		const before = numericCardValue(alexComposite.textContent ?? '');

		const presetSelect = getByLabelText('Metric weight preset') as HTMLSelectElement;
		await fireEvent.change(presetSelect, { target: { value: 'Engineering Manager' } });

		const after = numericCardValue(alexComposite.textContent ?? '');
		expect(after).not.toBe(before);
		expect(getByTestId('preset-description').textContent).toContain('Leadership weighting');
	});
});
