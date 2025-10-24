import API_URL from "./api";

const BASE = `${API_URL}/applications`;

export const APPLICATION_ROUTES = {
    getApplicationDetails: (id: string) => `${BASE}/get-application-details/${id}`,
    getJobApplications: (jobId: string) => `${BASE}/job/${jobId}/get-job-applications`,
    recruiterAllApplications: `${BASE}/recruiter/all-applications`,
    updateApplicationStatus: (id: string) => `${BASE}/update-application-status/${id}`,
    recruiterApplicationStatistics: `${BASE}/recruiter/application-statistics`,
    withdrawApplication: (id: string) => `${BASE}/withdraw-application/${id}`,
} as const;

export default APPLICATION_ROUTES;
