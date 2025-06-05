// src/hooks/useAuthCheck.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useAuthCheck() {
  const [status, setStatus] = useState('loading'); // 'loading', 'authenticated', 'unauthenticated'

  useEffect(() => {
    axios.get(`/api/auth/check-auth`, {
      withCredentials: true,
    })
    .then(() => setStatus('authenticated'))
    .catch(() => setStatus('unauthenticated'));
  }, []);

  return status;
}
