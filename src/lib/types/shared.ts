export type StatusType = 'active' | 'inactive' | 'pending' | 'blocked' | 'completed';

export interface Person {
	id: string;
	name: string;
	email: string;
	role: string;
	team: string;
	avatarUrl?: string;
}

export interface TeamRef {
	id: string;
	name: string;
}

export interface PaginationParams {
	page: number;
	pageSize: number;
}

export interface PaginatedResponse<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface FilterOption {
	value: string;
	label: string;
	count?: number;
}

export interface KpiSummary {
	label: string;
	value: string | number;
	change?: number;
	changeLabel?: string;
	trend?: 'up' | 'down' | 'flat';
}
