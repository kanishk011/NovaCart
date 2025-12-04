'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

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
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#667eea',
  },
};

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    gsap.from('.contact-hero', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.contact-info', {
      x: -50,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out',
    });

    gsap.from('.contact-form', {
      x: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out',
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 2000);
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Email Us',
      content: 'support@novacart.com',
      subtitle: 'We reply within 24 hours',
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      subtitle: 'Mon-Fri 9AM-6PM EST',
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: 'Visit Us',
      content: '123 Commerce Street',
      subtitle: 'San Francisco, CA 94102',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh' }}>

      {/* Hero Section */}
      <Box
        className="contact-hero"
        sx={{
          pt: 12,
          pb: 8,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px', mx: 'auto' }}
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </Typography>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {contactInfo.map((info, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <MotionPaper
                className="contact-info"
                whileHover={{ y: -8 }}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    bgcolor: 'rgba(102, 126, 234, 0.05)',
                  },
                }}
              >
                <Box sx={{ color: '#667eea', mb: 2 }}>
                  {info.icon}
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                  {info.title}
                </Typography>
                <Typography variant="body1" sx={{ color: '#667eea', fontWeight: 600, mb: 0.5 }}>
                  {info.content}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  {info.subtitle}
                </Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Contact Form */}
      <Container sx={{ pb: 12 }}>
        <MotionPaper
          className="contact-form"
          sx={{
            p: { xs: 4, md: 6 },
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ color: 'white', fontWeight: 700, mb: 1 }}
          >
            Send Us a Message
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 4 }}
          >
            Fill out the form below and we'll get back to you within 24 hours
          </Typography>

          <AnimatePresence>
            {submitted && (
              <MotionBox
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              >
                <Alert
                  severity="success"
                  sx={{
                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                    color: '#4caf50',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                  }}
                >
                  Thank you for contacting us! We'll get back to you soon.
                </Alert>
              </MotionBox>
            )}
          </AnimatePresence>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={formData.name}
                  onChange={handleChange('name')}
                  required
                  sx={inputStyles}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  required
                  sx={inputStyles}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.subject}
                  onChange={handleChange('subject')}
                  required
                  sx={inputStyles}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Message"
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleChange('message')}
                  required
                  sx={inputStyles}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              sx={{
                mt: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50px',
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Send Message
            </Button>
          </Box>
        </MotionPaper>
      </Container>

      {/* FAQ Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container>
          <Typography
            variant="h3"
            align="center"
            sx={{ color: 'white', fontWeight: 800, mb: 2 }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 6 }}
          >
            Find quick answers to common questions
          </Typography>

          <Grid container spacing={3} sx={{ maxWidth: '900px', mx: 'auto' }}>
            {[
              {
                q: 'What are your shipping times?',
                a: 'We offer free standard shipping (5-7 business days) and express shipping (2-3 business days) options.',
              },
              {
                q: 'What is your return policy?',
                a: 'We offer a 30-day return policy for most items. Products must be unused and in original packaging.',
              },
              {
                q: 'Do you ship internationally?',
                a: 'Yes, we ship to over 100 countries worldwide. Shipping costs and times vary by location.',
              },
              {
                q: 'How can I track my order?',
                a: 'Once your order ships, you\'ll receive a tracking number via email. You can also track orders in your account dashboard.',
              },
            ].map((faq, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'rgba(102, 126, 234, 0.4)',
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: '#667eea', fontWeight: 700, mb: 1 }}
                  >
                    {faq.q}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7 }}
                  >
                    {faq.a}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Map Section */}
      <Box
        sx={{
          position: 'relative',
          height: 450,
          bgcolor: '#0f0f1e',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Decorative Map Background */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: `
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            opacity: 0.3,
          }}
        />

        {/* Location Marker */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          <MotionBox
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <LocationOnIcon
              sx={{
                fontSize: 80,
                color: '#667eea',
                filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.6))',
                mb: 2,
              }}
            />
          </MotionBox>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 1,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            NovaCart HQ
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            123 Commerce Street, San Francisco, CA 94102
          </Typography>
          <Button
            variant="outlined"
            sx={{
              mt: 3,
              color: 'white',
              borderColor: '#667eea',
              px: 4,
              py: 1,
              borderRadius: '50px',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#667eea',
                bgcolor: 'rgba(102, 126, 234, 0.2)',
              },
            }}
            onClick={() => window.open('https://maps.google.com', '_blank')}
          >
            Open in Maps
          </Button>
        </Box>

        {/* Decorative Circles */}
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 150 + i * 100,
              height: 150 + i * 100,
              borderRadius: '50%',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              animation: `pulse ${2 + i}s ease-in-out infinite`,
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 0.3,
                  transform: 'translate(-50%, -50%) scale(1)',
                },
                '50%': {
                  opacity: 0.1,
                  transform: 'translate(-50%, -50%) scale(1.1)',
                },
              },
            }}
          />
        ))}
      </Box>

      {/* Bottom CTA */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Still have questions?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 4 }}>
            Our support team is here to help you 24/7
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => window.location.href = 'mailto:support@novacart.com'}
              sx={{
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Email Support
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/products')}
              sx={{
                px: 4,
                py: 1.5,
                color: 'white',
                borderColor: 'white',
                borderRadius: '50px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#667eea',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Browse Products
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
