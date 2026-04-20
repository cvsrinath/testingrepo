import { defaultPeriod, periodOptions, reportLastUpdated } from '$lib/mock/kypData';
import type { PeriodOption } from '$lib/types/kyp';
import { derived, writable } from 'svelte/store';

export const periodLabel = periodOptions;
export const selectedPeriod = writable<PeriodOption>(defaultPeriod);
export const lastUpdatedAt = writable<string>(reportLastUpdated);

export const selectedPeriodLabel = derived(selectedPeriod, (value) => value);
export const lastUpdatedLabel = derived(lastUpdatedAt, (value) => new Date(value).toLocaleString());

export function setPeriod(value: PeriodOption): void {
	selectedPeriod.set(value);
}

export function resetPeriod(): void {
	selectedPeriod.set(defaultPeriod);
}
