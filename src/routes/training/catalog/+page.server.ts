import { listCourses } from '$lib/mock/training';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const category = url.searchParams.get('category') ?? '';
	const difficulty = url.searchParams.get('difficulty') ?? '';
	const required = url.searchParams.get('required') ?? '';
	const q = url.searchParams.get('q') ?? '';
	const courses = listCourses({ category: category || undefined, difficulty: difficulty || undefined, required: required || undefined, q: q || undefined });
	return { courses, filters: { category, difficulty, required, q } };
};
