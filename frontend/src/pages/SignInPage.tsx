import React from 'react';
import SignInForm from '../components/SignInForm';
import { Container } from '@mui/material';
import useAuthRedirect from '../hooks/useAuth';

const SignInPage: React.FC = () => {
  useAuthRedirect();

  return (
    <Container maxWidth="sm">
      <SignInForm />
    </Container>
  );
};

export default SignInPage;
