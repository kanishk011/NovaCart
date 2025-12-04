'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Link,
  Divider,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(102, 126, 234, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#667eea',
      borderWidth: '2px',
    },
    '&.Mui-error fieldset': {
      borderColor: '#f44336',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
  },
  '& .MuiInputLabel-root.Mui-error': {
    color: '#f44336',
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });
  const [sessionExpired, setSessionExpired] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const formRef = useRef(null);

  // Check for expired session parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === 'true') {
      setSessionExpired(true);
      // Clear the parameter from URL
      router.replace('/login');
    }
  }, [router]);

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data: any) => {
      const { token, user } = data.login;
      dispatch(loginSuccess({ user, token }));

      // Success animation
      gsap.to('.login-form', {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        onComplete: () => router.push('/products'),
      });
    },
    onError: (error) => {
      dispatch(loginFailure(error.message));
      // Error shake animation
      gsap.fromTo('.login-form',
        { x: -10 },
        { x: 10, repeat: 3, yoyo: true, duration: 0.1 }
      );
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/products');
    }
  }, [isAuthenticated, router]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.login-logo', {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
    .from('.login-title', {
      y: 20,
      opacity: 0,
      duration: 0.5,
    }, '-=0.3')
    .from('.login-field', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.2');
  }, []);

  const validateEmail = (value: string) => {
    if (!value) {
      return 'Email is required';
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setValidationErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setValidationErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setValidationErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else {
      setValidationErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setTouched({ email: true, password: true });
    setValidationErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      gsap.fromTo('.login-form',
        { x: -10 },
        { x: 10, repeat: 3, yoyo: true, duration: 0.1 }
      );
      return;
    }

    dispatch(loginStart());
    await loginMutation({ variables: { email, password } });
  };

  const isFormValid = email && password && !validationErrors.email && !validationErrors.password;

  return (
    <Box
      suppressHydrationWarning
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 20% 30%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.5 },
            '50%': { opacity: 0.8 },
          },
        }}
      />

      {/* Floating orbs */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(30px, 30px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
          bottom: '-5%',
          right: '-5%',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />

      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionPaper
          className="login-form"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          elevation={24}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <MotionBox className="login-logo">
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  fontSize: { xs: '2.5rem', sm: '3.5rem' },
                  letterSpacing: -1,
                }}
              >
                NovaCart
              </Typography>
            </MotionBox>
            <Typography
              className="login-title"
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
              }}
            >
              Welcome Back
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Sign in to continue shopping
            </Typography>
          </Box>

          <AnimatePresence>
            {sessionExpired && (
              <MotionBox
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <Alert
                  severity="warning"
                  onClose={() => setSessionExpired(false)}
                  sx={{
                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                    color: '#ff9800',
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    '& .MuiAlert-icon': {
                      color: '#ff9800',
                    },
                  }}
                >
                  Your session has expired. Please log in again.
                </Alert>
              </MotionBox>
            )}
            {error && (
              <MotionBox
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <Alert
                  severity="error"
                  icon={<ErrorOutlineIcon />}
                  sx={{
                    bgcolor: 'rgba(211, 47, 47, 0.1)',
                    color: '#f44336',
                    border: '1px solid rgba(211, 47, 47, 0.3)',
                    '& .MuiAlert-icon': {
                      color: '#f44336',
                    },
                  }}
                >
                  {error}
                </Alert>
              </MotionBox>
            )}
          </AnimatePresence>

          <Box ref={formRef}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Email Field */}
              <Box className="login-field">
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => handleBlur('email')}
                  disabled={isLoading}
                  error={touched.email && !!validationErrors.email}
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: touched.email && (
                      <InputAdornment position="end">
                        {validationErrors.email ? (
                          <ErrorOutlineIcon sx={{ color: '#f44336' }} />
                        ) : email ? (
                          <CheckCircleOutlineIcon sx={{ color: '#4caf50' }} />
                        ) : null}
                      </InputAdornment>
                    ),
                  }}
                />
                <AnimatePresence>
                  {touched.email && validationErrors.email && (
                    <MotionBox
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>
                        {validationErrors.email}
                      </FormHelperText>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>

              {/* Password Field */}
              <Box className="login-field">
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleBlur('password')}
                  disabled={isLoading}
                  error={touched.password && !!validationErrors.password}
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <AnimatePresence>
                  {touched.password && validationErrors.password && (
                    <MotionBox
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>
                        {validationErrors.password}
                      </FormHelperText>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>

              <Link
                className="login-field"
                component="button"
                type="button"
                variant="body2"
                onClick={() => {}}
                sx={{
                  alignSelf: 'flex-end',
                  mt: 1,
                  mb: 1,
                  color: '#667eea',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#764ba2',
                    textDecoration: 'underline',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              className="login-field"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !isFormValid}
              sx={{
                mt: 2,
                mb: 3,
                py: 2,
                minHeight: '56px',
                opacity: '1 !important',
                visibility: 'visible !important',
                display: 'flex !important',
                background: isFormValid
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(102, 126, 234, 0.3)',
                borderRadius: '50px',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: isFormValid ? '0 8px 32px rgba(102, 126, 234, 0.4)' : 'none',
                border: '1px solid rgba(102, 126, 234, 0.5)',
                '&:hover': {
                  boxShadow: isFormValid ? '0 12px 48px rgba(102, 126, 234, 0.6)' : 'none',
                  transform: isFormValid ? 'translateY(-2px)' : 'none',
                  background: isFormValid
                    ? 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)'
                    : 'rgba(102, 126, 234, 0.3)',
                },
                '&.Mui-disabled': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  background: 'rgba(102, 126, 234, 0.3)',
                  border: '1px solid rgba(102, 126, 234, 0.5)',
                },
                transition: 'all 0.3s ease',
              }}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LockOpenIcon />}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider
              className="login-field"
              sx={{
                my: 2,
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&::before, &::after': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', px: 2 }}>
                OR
              </Typography>
            </Divider>

            <Box className="login-field" sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => router.push('/register')}
                startIcon={<PersonAddOutlinedIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: '50px',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#667eea',
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Create New Account
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3, p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', display: 'block', mb: 0.5 }}>
                Demo Credentials
              </Typography>
              <Typography variant="body2" sx={{ color: '#667eea', fontFamily: 'monospace' }}>
                demo@novacart.com / demo123
              </Typography>
            </Box>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
}
