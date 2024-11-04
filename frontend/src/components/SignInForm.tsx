import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { signin } from '@api/services/authService';
import { appRoutes } from '@constants/index';
import { SIGIN_TEXT } from '@strings/signin';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const initialValues = {
  email: '',
  password: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().required('Required'),
});

const {
  LOGIN_FAILED,
  NOT_HAVE_AN_ACCOUNT,
  LOGIN,
  SIGN_IN_TO_ACCESS_YOUR_ACCOUNT,
  SIGNUP,
  SUCCESS_LOGIN,
  WELCOME_BACK,
} = SIGIN_TEXT;
const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success',
  );

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      await signin(values);

      setSnackbarMessage(SUCCESS_LOGIN);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);

      navigate(appRoutes.application);
    } catch (error: any) {
      setSnackbarMessage(error?.response.data.message || LOGIN_FAILED);
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
        width: 1,
        maxWidth: 520,
        mt: 4,
        textAlign: 'center',
        borderRadius: 2,
        p: 5,
      }}
    >
      <Typography variant="h4" gutterBottom>
        {WELCOME_BACK}
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: '24px' }}>
        {SIGN_IN_TO_ACCESS_YOUR_ACCOUNT}
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
          sx={{ marginTop: 3 }}
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            LOGIN
          )}
        </Button>

        <Typography variant="body2" mt={3}>
          {NOT_HAVE_AN_ACCOUNT} {'  '}
          <Link component={RouterLink} to="/signup">
            {SIGNUP}
          </Link>
        </Typography>
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

export default SignInForm;
