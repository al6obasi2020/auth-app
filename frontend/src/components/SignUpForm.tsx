import React, { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  Box,
  Link,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { signup } from '@api/services/authService';
import { appRoutes } from '@constants/index';
import { SIGNUP_TEXT } from '@strings/signup';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const initialValues = {
  email: '',
  name: '',
  password: '',
};

const {
  ALREADY_HAVE_ACCOUNT,
  LOGIN,
  SIGN_UP,
  SIGNUP_FAILED,
  SUCCESSFUL_SIGNUP,
  WELCOME_MESSAGE,
} = SIGNUP_TEXT;

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  name: Yup.string()
    .required('Required')
    .min(6, 'Name must be at least 6 characters'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character',
    )
    .required('Required'),
});

const SignUpForm: React.FC = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success',
  );
  const navigate = useNavigate();

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleSubmit = async (values: any) => {
    try {
      await signup(values);
      setSnackbarMessage(SUCCESSFUL_SIGNUP);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      navigate(appRoutes.application);
    } catch (error: any) {
      setSnackbarMessage(error?.response?.data?.message || SIGNUP_FAILED);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      formik.resetForm();
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Paper
      sx={{
        width: '100%',
        maxWidth: 520,
        mt: 4,
        textAlign: 'center',
        borderRadius: 8,
        p: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
        }}
      >
        <img
          src="https://assets.easygenerator.com/fragment/auth-page/2024.09.20.master-1580d78a0f/fe2d0604cd7c37cb56fba71cae72c2e6.svg"
          alt="easygenerator logo"
          style={{ height: '40px' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {ALREADY_HAVE_ACCOUNT}
          </Typography>
          <Link href={appRoutes.signin} underline="none">
            <Button
              variant="text"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {LOGIN}
            </Button>
          </Link>
        </Box>
      </Box>

      <Typography variant="h4" gutterBottom>
        {WELCOME_MESSAGE}
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" flexDirection="column" alignItems="start" mb={4}>
          <TextField
            label="Email"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={
              <Box
                display="flex"
                alignItems="center"
                component="span"
                sx={{
                  visibility:
                    formik.touched.email && Boolean(formik.errors.email)
                      ? 'visible'
                      : 'hidden',
                  minHeight: '1.5em',
                }}
              >
                <ErrorOutlineIcon
                  color="error"
                  sx={{ fontSize: '14px', mr: 0.5 }}
                />
                <Typography variant="caption" color="error" fontSize={10}>
                  {formik.errors.email || ' '}
                </Typography>
              </Box>
            }
            margin="dense"
            autoComplete="email"
            fullWidth
          />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="start" mb={4}>
          <TextField
            label="Name"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={
              <Box
                display="flex"
                alignItems="center"
                component="span"
                sx={{
                  visibility:
                    formik.touched.name && Boolean(formik.errors.name)
                      ? 'visible'
                      : 'hidden',
                  minHeight: '1.5em',
                }}
              >
                <ErrorOutlineIcon
                  color="error"
                  sx={{ fontSize: '14px', mr: 0.5 }}
                />
                <Typography variant="caption" color="error" fontSize={10}>
                  {formik.errors.name || ' '}
                </Typography>
              </Box>
            }
            margin="dense"
            autoComplete="name"
            fullWidth
          />
        </Box>

        <Box display="flex" flexDirection="column" alignItems="start" mb={4}>
          <TextField
            label="Password"
            type="password"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={
              <Box
                display="flex"
                alignItems="center"
                component="span"
                sx={{
                  visibility:
                    formik.touched.password && Boolean(formik.errors.password)
                      ? 'visible'
                      : 'hidden',
                  minHeight: '1.5em',
                }}
              >
                <ErrorOutlineIcon
                  color="error"
                  sx={{ fontSize: '14px', mr: 0.5 }}
                />
                <Typography variant="caption" color="error" fontSize={10}>
                  {formik.errors.password || ' '}
                </Typography>
              </Box>
            }
            margin="dense"
            autoComplete="current-password"
            fullWidth
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          sx={{ mt: 3 }}
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            SIGN_UP
          )}
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SignUpForm;
