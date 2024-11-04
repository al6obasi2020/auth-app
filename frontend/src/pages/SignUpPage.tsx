import React from 'react';
import SignUpForm from '../components/SignUpForm';
import { Container } from '@mui/material';

const SignUpPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <SignUpForm />
    </Container>
  );
};

export default SignUpPage;
