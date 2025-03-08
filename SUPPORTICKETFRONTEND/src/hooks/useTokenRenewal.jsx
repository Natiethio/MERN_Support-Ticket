import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Utils/axiosInstance';
import { toast } from 'react-toastify';
import { AuthContext } from '../Context/AuthContext';

const useTokenRenewal = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setAuth, isLoggedout, setIsLoggedout } = useContext(AuthContext);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (isLoggedout){
      return;
    } 

    const renewToken = async () => {
      try {
        await api.post('/user/refresh_token');
        console.log('Access token renewed.');
      } catch (error) {
        console.error('Token renewal failed:', error);

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          // Clear auth and cookies
          setAuth(null);
          document.cookie = 'token_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
          document.cookie = 'refreshtoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

          // Show error toast
          toast.error('Your session expired. Please log in again.', {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: { backgroundColor: 'red', color: '#fff' },
          });

          // Redirect to login after a short delay
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        }
      }
    };

    // Run the renewal immediately and set an interval
    renewToken();
    const interval = setInterval(renewToken, 1 * 24 * 60 * 60 * 60 *  1000);

    // Cleanup interval when `isAuthenticated` changes or component unmounts
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate, setAuth]);
};

export default useTokenRenewal;
