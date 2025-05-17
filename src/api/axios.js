import axios from 'axios';
import { useSelector } from 'react-redux';
import { create } from 'zustand';

// Create a global loading store
const useLoadingStore = create((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

const useApi = () => {
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.id);
  const apiUrl = useSelector((state) => state.apiUrl);
  const adminType = useSelector((state) => state.adminType);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const api = axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: token || '',
      'X-User-ID': userId || '',
      'Content-Type': 'application/json',
      'adminType': adminType || '',
    },
  });

  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      setLoading(true);
      return config;
    },
    (error) => {
      setTimeout(() => {
        setLoading(false);
      }, 200);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      setTimeout(() => {
        setLoading(false);
      }, 200);
      return response;
    },
    (error) => {
      setTimeout(() => {
        setLoading(false);
      }, 200);
      return Promise.reject(error);
    }
  );

  return api;
};

export { useLoadingStore };
export default useApi;
