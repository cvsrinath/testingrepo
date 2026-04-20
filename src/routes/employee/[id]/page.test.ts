import { getEmployeeDetail } from '$lib/mock/kypData';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import EmployeePage from './+page.svelte';

describe('Employee page sections', () => {
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
});
