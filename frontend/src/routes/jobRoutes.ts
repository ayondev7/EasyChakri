import API_URL from ".";

const BASE = `${API_URL}/jobs`;

export const JOB_ROUTES = {
    create: `${BASE}/create-job`,
    getAll: `${BASE}/get-jobs`,
    getById: (id: string) => `${BASE}/get-job-details/${id}`,
    updateById: (id: string) => `${BASE}/update-job/${id}`,
    deleteById: (id: string) => `${BASE}/delete-job/${id}`,
    recruiterMyJobs: `${BASE}/recruiter/my-jobs`,
} as const;

export default JOB_ROUTES;