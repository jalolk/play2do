import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
});

apiClient.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');

  if (authStorage) {
    const parsedData = JSON.parse(authStorage);

    const token = parsedData?.state?.user?.token;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

export default apiClient;
