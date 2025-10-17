const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // In production, API calls will be relative to the same domain
  : 'http://localhost:5000';

export default API_BASE_URL;
