import API_URL from "./api";

const BASE = `${API_URL}/interviews`;

export const INTERVIEW_ROUTES = {
    scheduleInterview: `${BASE}/schedule-interview`,
    updateInterview: (id: string) => `${BASE}/update-interview/${id}`,
    getInterviewDetails: (id: string) => `${BASE}/get-interview-details/${id}`,
    recruiterMyInterviews: `${BASE}/recruiter/my-interviews`,
    seekerMyInterviews: `${BASE}/seeker/my-interviews`,
    cancelInterview: (id: string) => `${BASE}/cancel-interview/${id}`,
    interviewStatistics: `${BASE}/interview-statistics`,
    upcomingInterviews: `${BASE}/upcoming-interviews`,
} as const;

export default INTERVIEW_ROUTES;
