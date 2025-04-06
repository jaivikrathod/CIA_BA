import axios from 'axios';
import { useSelector } from 'react-redux';

const useApi = () => {
  const token = useSelector((state) => state.token);
  const userId = useSelector((state) => state.id);
  const apiUrl = useSelector((state) => state.apiUrl);

  const api = axios.create({
    baseURL: apiUrl,
    headers: {
      Authorization: token || '',
      'X-User-ID': userId || '',
      'Content-Type': 'application/json',
    },
  });

  return api;
};

export default useApi;
