import { getEmployeeDetail } from '$lib/mock/kypData';
import { resetPeriod } from '$lib/stores/period';
import { fireEvent, render } from '@testing-library/svelte';
import { afterEach, describe, expect, it } from 'vitest';
import EmployeePage from '../../employees/[id]/+page.svelte';

describe('Employee page sections', () => {
	afterEach(() => {
		resetPeriod();
	});

	it('renders radar and trend sections for employee detail', () => {
		const employee = getEmployeeDetail('alex-rivera');
		if (!employee) {
			throw new Error('Expected mock employee');
		}

		const { getByTestId, getByText } = render(EmployeePage, {
			data: { employee }
		});

		expect(getByTestId('radar-chart')).toBeInTheDocument();
		expect(getByTestId('trend-grid')).toBeInTheDocument();
		expect(getByText('Dimension Radar')).toBeInTheDocument();
		expect(getByText('13-Week Trends')).toBeInTheDocument();
	});

	it('updates charts when the review period changes', async () => {
		const employee = getEmployeeDetail('alex-rivera');
		if (!employee) {
			throw new Error('Expected mock employee');
		}

		const { container, getByLabelText } = render(EmployeePage, {
			data: { employee }
		});

		const polygon = container.querySelector('polygon');
		const polyline = container.querySelector('polyline');
		const beforePolygon = polygon?.getAttribute('points');
		const beforePolyline = polyline?.getAttribute('points');

		const periodSelect = getByLabelText('Review period') as HTMLSelectElement;
		await fireEvent.change(periodSelect, { target: { value: 'Q' } });

		expect(polygon?.getAttribute('points')).not.toBe(beforePolygon);
		expect(polyline?.getAttribute('points')).not.toBe(beforePolyline);
	});
});
