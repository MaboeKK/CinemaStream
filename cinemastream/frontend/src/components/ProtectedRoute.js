// src/components/ProtectedRoute.js
import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthCheck from '../hooks/useAuthCheck';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/auth/check-auth`, { withCredentials: true })
      .then(() => setIsAuth(true))
      .catch(() => {
        toast.error("Please login first");
        setIsAuth(false);
        navigate('/login');
      });
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return null;
  return children;
};
