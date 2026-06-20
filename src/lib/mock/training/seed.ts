import type { Certification, EmployeeTraining, EmployeeTrainingProfile, TrainingCourse, TrainingStatus } from '$lib/types/training';
import { employees, teams } from '$lib/mock/shared/employees';

export const courses: TrainingCourse[] = [
	{ id: 'sec-awareness', title: 'Security Awareness Training', category: 'security', description: 'Annual security awareness covering phishing, data handling, and access policies.', duration: '2 hours', difficulty: 'beginner', provider: 'KnowBe4', required: true, tags: ['security', 'annual', 'phishing'], recommendedFor: { roles: [], teams: [], tracks: ['all'] } },
	{ id: 'owasp-top10', title: 'OWASP Top 10 for Developers', category: 'security', description: 'Deep dive into the OWASP Top 10 vulnerabilities with code examples.', duration: '4 hours', difficulty: 'intermediate', provider: 'SANS', required: true, tags: ['security', 'owasp', 'web'], recommendedFor: { roles: ['Engineer', 'Senior Engineer', 'Staff Engineer'], teams: [], tracks: ['engineering'] } },
	{ id: 'gdpr-compliance', title: 'GDPR & Data Privacy Compliance', category: 'compliance', description: 'Understanding GDPR requirements and data privacy obligations.', duration: '3 hours', difficulty: 'beginner', provider: 'Internal', required: true, tags: ['gdpr', 'compliance', 'privacy'], recommendedFor: { roles: [], teams: [], tracks: ['all'] } },
	{ id: 'soc2-overview', title: 'SOC 2 Controls Overview', category: 'compliance', description: 'Introduction to SOC 2 Type II controls and their engineering implications.', duration: '2 hours', difficulty: 'intermediate', provider: 'Internal', required: false, tags: ['soc2', 'compliance', 'audit'], recommendedFor: { roles: ['Senior Engineer', 'Staff Engineer', 'Engineering Manager'], teams: [], tracks: ['leadership'] } },
	{ id: 'k8s-fundamentals', title: 'Kubernetes Fundamentals', category: 'technical', description: 'Core Kubernetes concepts: pods, deployments, services, and networking.', duration: '8 hours', difficulty: 'intermediate', provider: 'Linux Foundation', required: false, tags: ['kubernetes', 'containers', 'devops'], recommendedFor: { roles: ['Engineer', 'Senior Engineer'], teams: ['team-alpha', 'team-delta'], tracks: ['platform'] } },
	{ id: 'gcp-essentials', title: 'GCP Essentials', category: 'technical', description: 'Google Cloud Platform core services and best practices.', duration: '6 hours', difficulty: 'beginner', provider: 'Google Cloud', required: false, tags: ['gcp', 'cloud', 'infrastructure'], recommendedFor: { roles: [], teams: ['team-alpha', 'team-cirrus'], tracks: ['cloud'] } },
	{ id: 'aws-saa', title: 'AWS Solutions Architect Associate Prep', category: 'certification', description: 'Preparation course for the AWS Solutions Architect Associate exam.', duration: '40 hours', difficulty: 'advanced', provider: 'A Cloud Guru', required: false, tags: ['aws', 'cloud', 'certification'], recommendedFor: { roles: ['Senior Engineer', 'Staff Engineer'], teams: [], tracks: ['cloud'] } },
	{ id: 'leadership-101', title: 'Engineering Leadership 101', category: 'leadership', description: 'Foundational leadership skills for new engineering managers.', duration: '5 hours', difficulty: 'beginner', provider: 'Internal', required: false, tags: ['leadership', 'management'], recommendedFor: { roles: ['Engineering Manager'], teams: [], tracks: ['leadership'] } },
	{ id: 'incident-mgmt', title: 'Incident Management & Postmortems', category: 'technical', description: 'On-call practices, incident response, and blameless postmortem techniques.', duration: '3 hours', difficulty: 'intermediate', provider: 'Internal', required: false, tags: ['sre', 'incidents', 'on-call'], recommendedFor: { roles: ['Senior Engineer', 'Staff Engineer', 'Engineering Manager'], teams: [], tracks: ['platform', 'sre'] } },
	{ id: 'data-governance', title: 'Data Governance & Quality', category: 'compliance', description: 'Data lineage, quality standards, and governance processes.', duration: '4 hours', difficulty: 'intermediate', provider: 'Internal', required: false, tags: ['data', 'governance', 'quality'], recommendedFor: { roles: [], teams: ['team-cirrus'], tracks: ['data'] } },
	{ id: 'frontend-perf', title: 'Frontend Performance Optimization', category: 'technical', description: 'Core Web Vitals, bundle optimization, and rendering performance.', duration: '4 hours', difficulty: 'intermediate', provider: 'Frontend Masters', required: false, tags: ['frontend', 'performance', 'web'], recommendedFor: { roles: [], teams: ['team-beacon'], tracks: ['frontend'] } },
	{ id: 'secure-coding', title: 'Secure Coding Practices', category: 'security', description: 'Hands-on secure coding patterns in TypeScript and Go.', duration: '6 hours', difficulty: 'intermediate', provider: 'Veracode', required: true, tags: ['security', 'coding', 'typescript'], recommendedFor: { roles: ['Engineer', 'Senior Engineer', 'Staff Engineer'], teams: [], tracks: ['engineering'] } },
	{ id: 'gcp-pro-cert', title: 'GCP Professional Cloud Architect Prep', category: 'certification', description: 'Advanced Google Cloud architecture patterns and exam preparation.', duration: '60 hours', difficulty: 'advanced', provider: 'Coursera', required: false, tags: ['gcp', 'certification', 'architecture'], recommendedFor: { roles: ['Staff Engineer'], teams: ['team-alpha', 'team-delta'], tracks: ['cloud'] } },
	{ id: 'agile-scrum', title: 'Agile & Scrum Fundamentals', category: 'onboarding', description: 'Agile principles, Scrum ceremonies, and team workflow.', duration: '3 hours', difficulty: 'beginner', provider: 'Internal', required: true, tags: ['agile', 'scrum', 'onboarding'], recommendedFor: { roles: [], teams: [], tracks: ['all'] } },
	{ id: 'code-review', title: 'Effective Code Review', category: 'technical', description: 'Best practices for giving and receiving code reviews constructively.', duration: '2 hours', difficulty: 'beginner', provider: 'Internal', required: false, tags: ['code-review', 'collaboration'], recommendedFor: { roles: ['Engineer', 'Senior Engineer'], teams: [], tracks: ['engineering'] } },
];

const certPool: Omit<Certification, 'id'>[] = [
	{ name: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', earnedDate: '2024-03-15', expiryDate: '2027-03-15', status: 'active' },
	{ name: 'GCP Professional Cloud Architect', issuer: 'Google Cloud', earnedDate: '2023-11-01', expiryDate: '2025-11-01', status: 'expiring_soon' },
	{ name: 'Certified Kubernetes Administrator', issuer: 'CNCF', earnedDate: '2024-06-01', expiryDate: '2026-06-01', status: 'active' },
	{ name: 'CISSP', issuer: 'ISC2', earnedDate: '2022-08-01', expiryDate: '2025-08-01', status: 'expiring_soon' },
	{ name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', earnedDate: '2025-01-10', expiryDate: '2028-01-10', status: 'active' },
	{ name: 'GCP Associate Cloud Engineer', issuer: 'Google Cloud', earnedDate: '2024-09-01', expiryDate: '2026-09-01', status: 'active' },
	{ name: 'Terraform Associate', issuer: 'HashiCorp', earnedDate: '2025-02-01', expiryDate: '2027-02-01', status: 'active' },
	{ name: 'PCEP (Python Certified)', issuer: 'Python Institute', earnedDate: '2023-05-01', expiryDate: undefined, status: 'active' },
];

function makeCert(idx: number, employeeIdx: number): Certification {
	return { id: `cert-${employeeIdx}-${idx}`, ...certPool[idx % certPool.length] };
}

function makeTraining(courseIdx: number, status: TrainingStatus, opts: Partial<EmployeeTraining> = {}): EmployeeTraining {
	const course = courses[courseIdx % courses.length];
	return {
		courseId: course.id,
		course,
		status,
		assignedDate: '2026-01-01',
		...opts,
	};
}

function calcRate(trainings: EmployeeTraining[]): number {
	if (trainings.length === 0) return 0;
	return Math.round((trainings.filter((t) => t.status === 'completed').length / trainings.length) * 100);
}

function countOverdue(trainings: EmployeeTraining[]): number {
	return trainings.filter((t) => t.status === 'overdue').length;
}

export const trainingProfiles: EmployeeTrainingProfile[] = employees.map((emp, i) => {
	const team = { id: emp.team, name: emp.team.replace('team-', 'Team ').replace(/\b\w/g, c => c.toUpperCase()) };
	const trainings: EmployeeTraining[] = [
		makeTraining(0, 'completed', { completedDate: '2026-02-10', score: 92 }),
		makeTraining(1, i % 3 === 0 ? 'overdue' : 'completed', { dueDate: '2026-04-01', completedDate: i % 3 === 0 ? undefined : '2026-03-20', score: 85 }),
		makeTraining(2, 'completed', { completedDate: '2026-01-20', score: 90 }),
		makeTraining(13, 'completed', { completedDate: '2026-01-15', score: 88 }),
		makeTraining(i % courses.length, i % 4 === 0 ? 'in_progress' : i % 5 === 0 ? 'not_started' : 'completed', { dueDate: '2026-07-01' }),
		makeTraining((i + 3) % courses.length, i % 7 === 0 ? 'overdue' : 'not_started', { dueDate: '2026-06-30' }),
	];

	const certs: Certification[] = i % 2 === 0 ? [makeCert(i % certPool.length, i)] : i % 3 === 0 ? [makeCert(i % certPool.length, i), makeCert((i + 1) % certPool.length, i)] : [];

	return {
		person: emp,
		team,
		trainings,
		certifications: certs,
		completionRate: calcRate(trainings),
		overdueCount: countOverdue(trainings),
		recommendedCourses: courses.filter((c) => c.recommendedFor.roles.includes(emp.role)).slice(0, 3),
	};
});
