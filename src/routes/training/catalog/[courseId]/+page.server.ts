import { getCourse, trainingProfiles } from '$lib/mock/training';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const course = getCourse(params.courseId);
	if (!course) error(404, 'Course not found');
	const assigned = trainingProfiles.flatMap((p) => p.trainings.filter((t) => t.courseId === params.courseId)).length;
	const completed = trainingProfiles.flatMap((p) => p.trainings.filter((t) => t.courseId === params.courseId && t.status === 'completed')).length;
	const inProgress = trainingProfiles.flatMap((p) => p.trainings.filter((t) => t.courseId === params.courseId && t.status === 'in_progress')).length;
	return { course, stats: { assigned, completed, inProgress } };
};
