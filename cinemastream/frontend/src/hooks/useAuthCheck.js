// src/hooks/useAuthCheck.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useAuthCheck() {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    // Delay slightly to allow cookies to be set
    const timer = setTimeout(() => {
      axios.get('/api/auth/check-auth', {
        withCredentials: true,
      })
      .then(() => isMounted && setStatus('authenticated'))
      .catch(() => isMounted && setStatus('unauthenticated'));
    }, 500); // 0.5 second delay

    return () => {
      clearTimeout(timer);
      isMounted = false;
    };
  }, []);

  return status;
}
