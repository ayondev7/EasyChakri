import API_URL from "./api";

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
    similarJobs: (id: string) => `${BASE}/similar-jobs/${id}`,
    apply: (id: string) => `${BASE}/apply-job/${id}`,
    myApplications: `${BASE}/seeker/my-applications`,
    applicationStats: `${BASE}/seeker/application-stats`,
    saveJob: (id: string) => `${BASE}/save-job/${id}`,
    unsaveJob: (id: string) => `${BASE}/unsave-job/${id}`,
    savedJobs: `${BASE}/seeker/saved-jobs`,
    checkSaved: (id: string) => `${BASE}/check-saved-job/${id}`,
} as const;

export default JOB_ROUTES;