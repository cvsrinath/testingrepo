import { json } from '@sveltejs/kit';
import { listCourses } from '$lib/mock/training';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const category = url.searchParams.get('category') ?? undefined;
	const difficulty = url.searchParams.get('difficulty') ?? undefined;
	const q = url.searchParams.get('q') ?? undefined;
	return json(listCourses({ category: category as never, difficulty: difficulty as never, q }));
};
