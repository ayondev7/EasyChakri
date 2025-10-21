import AUTH_ROUTES from "./authRoutes"
import COMPANY_ROUTES from "./companyRoutes"
import JOB_ROUTES from "./jobRoutes"
import USER_ROUTES from "./userRoutes"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

export { AUTH_ROUTES, COMPANY_ROUTES, JOB_ROUTES, USER_ROUTES }

export default API_URL;
