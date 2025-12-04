'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess } from '@/store/slices/authSlice';
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
  InputAdornment,
  IconButton,
  FormHelperText,
  LinearProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface ValidationErrors {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  submit?: string;
}

interface TouchedFields {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  firstName: boolean;
  lastName: boolean;
  phone: boolean;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
    phone: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const formRef = useRef(null);

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data: any) => {
      const { token, user } = data.register;
      dispatch(loginSuccess({ user, token }));

      // Success animation
      gsap.to('.register-form', {
        scale: 0.95,
        opacity: 0,
        duration: 0.3,
        onComplete: () => router.push('/products'),
      });
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, submit: error.message }));
      // Error shake animation
      gsap.fromTo('.register-form',
        { x: -10 },
        { x: 10, repeat: 3, yoyo: true, duration: 0.1 }
      );
    },
  });

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.register-logo', {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
    .from('.register-title', {
      y: 20,
      opacity: 0,
      duration: 0.5,
    }, '-=0.3')
    .from('.register-field', {
      y: 30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.2');
  }, []);

  // Validation functions
  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
      return 'Invalid email address';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain a number';
    return '';
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return 'Please confirm your password';
    if (value !== formData.password) return 'Passwords do not match';
    return '';
  };

  const validateName = (value: string, field: string) => {
    if (!value) return `${field} is required`;
    if (value.length < 2) return `${field} must be at least 2 characters`;
    if (!/^[a-zA-Z\s]+$/.test(value)) return `${field} must contain only letters`;
    return '';
  };

  const validatePhone = (value: string) => {
    if (value && !/^\+?[\d\s-()]+$/.test(value)) return 'Invalid phone number';
    return '';
  };

  // Password strength calculator
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 25;
    if (/(?=.*[a-z])/.test(password)) strength += 15;
    if (/(?=.*[A-Z])/.test(password)) strength += 15;
    if (/(?=.*\d)/.test(password)) strength += 10;
    if (/(?=.*[@$!%*?&])/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthColor = () => {
    if (passwordStrength < 40) return '#f44336';
    if (passwordStrength < 70) return '#ff9800';
    return '#4caf50';
  };

  const getStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  // Handle field changes
  const handleFieldChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field as keyof TouchedFields]) {
      let error = '';
      switch (field) {
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          if (touched.confirmPassword && formData.confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(formData.confirmPassword) }));
          }
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(value);
          break;
        case 'firstName':
          error = validateName(value, 'First name');
          break;
        case 'lastName':
          error = validateName(value, 'Last name');
          break;
        case 'phone':
          error = validatePhone(value);
          break;
      }
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof TouchedFields) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    let error = '';
    switch (field) {
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'password':
        error = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.confirmPassword);
        break;
      case 'firstName':
        error = validateName(formData.firstName, 'First name');
        break;
      case 'lastName':
        error = validateName(formData.lastName, 'Last name');
        break;
      case 'phone':
        error = validatePhone(formData.phone);
        break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async () => {
    // Validate all fields
    const validationErrors: ValidationErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
      firstName: validateName(formData.firstName, 'First name'),
      lastName: validateName(formData.lastName, 'Last name'),
    };

    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      firstName: true,
      lastName: true,
      phone: true,
    });

    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(error => error !== '');

    if (hasErrors) {
      gsap.fromTo('.register-form',
        { x: -10 },
        { x: 10, repeat: 3, yoyo: true, duration: 0.1 }
      );
      return;
    }

    const { confirmPassword, ...input } = formData;
    await registerMutation({ variables: { input } });
  };

  const isFormValid =
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.firstName &&
    formData.lastName &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword &&
    !errors.firstName &&
    !errors.lastName;

  return (
    <Box
      suppressHydrationWarning
      sx={{
        minHeight: '100vh',
        height: 'auto',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        py: { xs: 4, sm: 6 },
      }}
    >
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(118, 75, 162, 0.15) 0%, transparent 50%)',
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
          right: '-10%',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0)' },
            '50%': { transform: 'translate(-30px, 30px)' },
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
          left: '-5%',
          filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionPaper
          className="register-form"
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
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <MotionBox className="register-logo">
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
              className="register-title"
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'white',
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
              }}
            >
              Create Your Account
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Join thousands of happy shoppers
            </Typography>
          </Box>

          <AnimatePresence>
            {errors.submit && (
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
                  }}
                >
                  {errors.submit}
                </Alert>
              </MotionBox>
            )}
          </AnimatePresence>

          <Box ref={formRef}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Name Fields Row */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box className="register-field" sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={formData.firstName}
                    onChange={handleFieldChange('firstName')}
                    onBlur={() => handleBlur('firstName')}
                    disabled={loading}
                    error={touched.firstName && !!errors.firstName}
                    sx={inputStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: touched.firstName && (
                        <InputAdornment position="end">
                          {errors.firstName ? (
                            <ErrorOutlineIcon sx={{ color: '#f44336' }} />
                          ) : formData.firstName ? (
                            <CheckCircleOutlineIcon sx={{ color: '#4caf50' }} />
                          ) : null}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <AnimatePresence>
                    {touched.firstName && errors.firstName && (
                      <MotionBox initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>{errors.firstName}</FormHelperText>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </Box>

                <Box className="register-field" sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={formData.lastName}
                    onChange={handleFieldChange('lastName')}
                    onBlur={() => handleBlur('lastName')}
                    disabled={loading}
                    error={touched.lastName && !!errors.lastName}
                    sx={inputStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: touched.lastName && (
                        <InputAdornment position="end">
                          {errors.lastName ? (
                            <ErrorOutlineIcon sx={{ color: '#f44336' }} />
                          ) : formData.lastName ? (
                            <CheckCircleOutlineIcon sx={{ color: '#4caf50' }} />
                          ) : null}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <AnimatePresence>
                    {touched.lastName && errors.lastName && (
                      <MotionBox initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>{errors.lastName}</FormHelperText>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </Box>
              </Box>

              {/* Email Field */}
              <Box className="register-field">
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleFieldChange('email')}
                  onBlur={() => handleBlur('email')}
                  disabled={loading}
                  error={touched.email && !!errors.email}
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: touched.email && (
                      <InputAdornment position="end">
                        {errors.email ? (
                          <ErrorOutlineIcon sx={{ color: '#f44336' }} />
                        ) : formData.email ? (
                          <CheckCircleOutlineIcon sx={{ color: '#4caf50' }} />
                        ) : null}
                      </InputAdornment>
                    ),
                  }}
                />
                <AnimatePresence>
                  {touched.email && errors.email && (
                    <MotionBox initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>{errors.email}</FormHelperText>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>

              {/* Phone Field */}
              <Box className="register-field">
                <TextField
                  fullWidth
                  label="Phone Number (Optional)"
                  value={formData.phone}
                  onChange={handleFieldChange('phone')}
                  onBlur={() => handleBlur('phone')}
                  disabled={loading}
                  sx={inputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneOutlinedIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box className="register-field">
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleFieldChange('password')}
                  onBlur={() => handleBlur('password')}
                  disabled={loading}
                  error={touched.password && !!errors.password}
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <MotionBox
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    sx={{ mt: 1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getStrengthColor(),
                            borderRadius: 3,
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: getStrengthColor(),
                          fontWeight: 600,
                          minWidth: 60,
                        }}
                      >
                        {getStrengthText()}
                      </Typography>
                    </Box>
                  </MotionBox>
                )}

                <AnimatePresence>
                  {touched.password && errors.password && (
                    <MotionBox initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>{errors.password}</FormHelperText>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>

              {/* Confirm Password Field */}
              <Box className="register-field">
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleFieldChange('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                  disabled={loading}
                  error={touched.confirmPassword && !!errors.confirmPassword}
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
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <AnimatePresence>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <MotionBox initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>{errors.confirmPassword}</FormHelperText>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>
            </Box>

            <Button
              className="register-field"
              onClick={handleSubmit}
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !isFormValid}
              sx={{
                mt: 3,
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
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Already have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => router.push('/login')}
                  sx={{
                    fontWeight: 600,
                    color: '#667eea',
                    textDecoration: 'none',
                    '&:hover': {
                      color: '#764ba2',
                      textDecoration: 'underline',
                    },
                    transition: 'color 0.3s',
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
}
