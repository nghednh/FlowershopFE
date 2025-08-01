import axios from 'axios';

// Create axios instance with base configuration
const instance = axios.create({
    baseURL: 'https://localhost:5001', // Your backend URL
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
instance.interceptors.request.use(
    (config) => {
        console.log('Request:', config);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle responses and errors
instance.interceptors.response.use(
    (response) => {
        console.log('Response:', response);
        // Return the data directly from successful responses
        return response.data;
    },
    async (error) => {
        console.error('Response error:', error);
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const refreshResponse = await axios.post('https://localhost:5001/api/auth/refresh', {
                        refreshToken: refreshToken
                    });

                    if (refreshResponse.data.success) {
                        const newAccessToken = refreshResponse.data.data.accessToken;
                        localStorage.setItem('access_token', newAccessToken);

                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return instance(originalRequest);
                    }
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }

            // If refresh fails, clear tokens and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user.role');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default instance;