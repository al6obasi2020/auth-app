import defaultColors from './colors';
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: defaultColors.primary,
      contrastText: defaultColors.textRegular50,
    },
    secondary: {
      main: defaultColors.success,
      contrastText: defaultColors.textRegular50,
    },
    error: {
      main: defaultColors.danger,
    },
    background: {
      default: defaultColors.background,
      paper: defaultColors.paperBackground,
    },
    text: {
      primary: defaultColors.textPrimary,
      secondary: defaultColors.textSecondary,
    },
  },
  typography: {
    fontFamily: defaultColors.fontFamily,
    fontSize: parseInt(defaultColors.fontSize, 10),
  },
  shadows: [
    'none',
    defaultColors.shadowS,
    defaultColors.shadowM,
    defaultColors.shadowL,
    defaultColors.shadowXL,
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${defaultColors.borderColor}`,
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid ${defaultColors.secondaryHover}`,
          },
          '&.Mui-focused:before': {
            borderBottom: `1px solid ${defaultColors.secondaryHover}`,
          },
          '&.Mui-focused:after': {
            borderBottom: `3px solid ${defaultColors.secondaryHover}`,
          },
          '&.Mui-error:before': {
            borderBottom: `1px solid ${defaultColors.danger}`,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: defaultColors.textSecondary,
          '&.Mui-focused': {
            color: defaultColors.textSecondary,
          },
          '&.Mui-error': {
            color: defaultColors.danger,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-text': {
            color: defaultColors.textRegular50,
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          backgroundImage: defaultColors.primaryGradient,
          color: defaultColors.textRegular50,
          borderRadius: defaultColors.borderRadius,
          padding: '12px 24px',
          boxShadow: defaultColors.shadowM,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundImage: defaultColors.successBtnHover,
            boxShadow: defaultColors.shadowL,
          },
          '&:active': {
            boxShadow: defaultColors.shadowS,
          },
          '.disabled, &.Mui-disabled, &.MuiButtonBase-root.Mui-disabled': {
            backgroundColor: defaultColors.textSecondary,
            backgroundImage: defaultColors.successBtnHDisabled,
            boxShadow: 'none',
            color: defaultColors.textRegular50,
            cursor: 'not-allowed',
            pointerEvents: 'none',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '& fieldset': {
              border: 'none',
            },
            '&.Mui-error': {
              boxShadow: `inset 1px -3px 0 -1px ${defaultColors.danger}`,
            },
            '&.Mui-focused.Mui-error': {
              boxShadow: `inset 1px -3px 0 -1px ${defaultColors.danger}`,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        },
      },
    },
  },
});

export default theme;
