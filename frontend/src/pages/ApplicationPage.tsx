import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Container,
  CircularProgress,
  Button,
} from '@mui/material';
import { getUserInfo } from '../api/services/authService';
import { APPLICATION_TEXT } from '../strings/application';
import { appRoutes } from '@constants/index';
import Cookies from 'js-cookie';

const { WELCOME_MESSAGE, NAME_LABEL, EMAIL_LABEL, LOGOUT, USER_NOT_AVAILABLE } =
  APPLICATION_TEXT;
const ApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string; name: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        setUser(response.data.user);
      } catch (error) {
        navigate(appRoutes.signin);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    // Clear the cookies
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');

    // Redirect to the sign-in page
    navigate(appRoutes.signin, { replace: true });
  };

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          {WELCOME_MESSAGE}
        </Typography>
        {user ? (
          <>
            <Typography variant="body1" mt={2}>
              {NAME_LABEL}
              {user.name}
            </Typography>
            <Typography variant="body1" mt={1}>
              {EMAIL_LABEL}
              {user.email}
            </Typography>
          </>
        ) : (
          <Typography variant="body1" color="error">
            {USER_NOT_AVAILABLE}
          </Typography>
        )}
        <Button
          variant="text"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 3 }}
        >
          {LOGOUT}
        </Button>
      </Box>
    </Container>
  );
};

export default ApplicationPage;
