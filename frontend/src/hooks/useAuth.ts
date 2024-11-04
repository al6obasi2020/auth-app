import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { appRoutes } from '@constants/index';

interface DecodedToken {
  exp?: number;
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = Cookies.get('accessToken');

      if (accessToken) {
        try {
          const decodedToken: DecodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            navigate(appRoutes.application, { replace: true });
          } else {
            setIsAuthenticated(false);
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            navigate(appRoutes.signin, { replace: true });
          }
        } catch (error) {
          setIsAuthenticated(false);
          navigate(appRoutes.signin, { replace: true });
        }
      } else {
        setIsAuthenticated(false);
        navigate(appRoutes.signin, { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  return isAuthenticated;
};

export default useAuth;
