import { writable } from 'svelte/store';

export type ModuleId = 'home' | 'kyp' | 'onboarding' | 'infrastructure' | 'training' | 'reports';

export interface ModuleDefinition {
	id: ModuleId;
	label: string;
	href: string;
	icon: string;
	description: string;
}

export const modules: ModuleDefinition[] = [
	{ id: 'home', label: 'Dashboard', href: '/', icon: '📊', description: 'Platform overview' },
	{ id: 'kyp', label: 'KYP', href: '/kyp', icon: '⚡', description: 'Know Your Performance' },
	{ id: 'onboarding', label: 'Onboarding', href: '/onboarding', icon: '🚀', description: 'Employee Onboarding' },
	{ id: 'infrastructure', label: 'Infrastructure', href: '/infrastructure', icon: '🏗️', description: 'Infrastructure Inventory' },
	{ id: 'training', label: 'Training', href: '/training', icon: '📚', description: 'Training Management' },
	{ id: 'reports', label: 'Reports', href: '/reports', icon: '📋', description: 'Stakeholder Reports' },
];

export const activeModule = writable<ModuleId>('home');
