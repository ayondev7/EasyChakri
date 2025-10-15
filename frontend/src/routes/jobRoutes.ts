import API_URL from ".";

const BASE = `${API_URL}/jobs`;

export const JOB_ROUTES = {
    create: `${BASE}/create-job`,
    getAll: `${BASE}/get-jobs`,
    getById: (id: string) => `${BASE}/get-job-details/${id}`,
    updateById: (id: string) => `${BASE}/update-job/${id}`,
    deleteById: (id: string) => `${BASE}/delete-job/${id}`,
    recruiterMyJobs: `${BASE}/recruiter/my-jobs`,
    statsByExperience: `${BASE}/stats/by-experience`,
    statsByCategory: `${BASE}/stats/by-category`,
    statsByLocation: `${BASE}/stats/by-location`,
    statsBySkill: `${BASE}/stats/by-skill`,
    statsTrending: `${BASE}/stats/trending`,
    similarJobs: (id: string) => `${BASE}/similar/${id}`,
} as const;

export default JOB_ROUTES;