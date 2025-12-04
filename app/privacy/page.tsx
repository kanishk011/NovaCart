'use client';

import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Paper, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import LockIcon from '@mui/icons-material/Lock';

const MotionBox = motion(Box);

export default function PrivacyPage() {
  const router = useRouter();

  useGSAP(() => {
    gsap.from('.privacy-hero', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.privacy-content', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out',
    });
  }, []);

  const sections = [
    {
      title: '1. Information We Collect',
      content: [
        'Personal Information: When you create an account, we collect your name, email address, phone number, and shipping address.',
        'Payment Information: We collect payment details necessary to process your orders. All payment information is encrypted and processed securely through our payment partners.',
        'Usage Data: We automatically collect information about how you interact with our platform, including IP address, browser type, pages visited, and time spent on pages.',
        'Cookies: We use cookies and similar technologies to enhance your experience and analyze platform usage.',
      ],
    },
    {
      title: '2. How We Use Your Information',
      content: [
        'To process and fulfill your orders',
        'To communicate with you about your account and orders',
        'To personalize your shopping experience',
        'To improve our platform and services',
        'To detect and prevent fraud',
        'To comply with legal obligations',
        'To send you marketing communications (with your consent)',
      ],
    },
    {
      title: '3. Information Sharing',
      content: [
        'We do not sell your personal information to third parties.',
        'We may share your information with:',
        '• Service providers who help us operate our platform',
        '• Payment processors to complete transactions',
        '• Shipping partners to deliver your orders',
        '• Law enforcement when required by law',
        'All third parties are bound by strict confidentiality agreements.',
      ],
    },
    {
      title: '4. Data Security',
      content: [
        'We implement industry-standard security measures to protect your data:',
        '• SSL/TLS encryption for all data transmission',
        '• Encrypted storage of sensitive information',
        '• Regular security audits and updates',
        '• Restricted access to personal data',
        '• Secure authentication systems',
        'However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      title: '5. Your Rights',
      content: [
        'You have the right to:',
        '• Access your personal data',
        '• Correct inaccurate data',
        '• Request deletion of your data',
        '• Object to data processing',
        '• Data portability',
        '• Withdraw consent',
        'To exercise these rights, contact us at privacy@novacart.com',
      ],
    },
    {
      title: '6. Cookies and Tracking',
      content: [
        'We use the following types of cookies:',
        '• Essential Cookies: Required for platform functionality',
        '• Analytics Cookies: Help us understand platform usage',
        '• Marketing Cookies: Used to deliver relevant advertisements',
        'You can control cookies through your browser settings. Note that disabling cookies may affect platform functionality.',
      ],
    },
    {
      title: '7. Children\'s Privacy',
      content: [
        'Our platform is not intended for users under 13 years of age.',
        'We do not knowingly collect information from children under 13.',
        'If we discover we have collected information from a child under 13, we will delete it immediately.',
        'Parents or guardians who believe we may have collected information from a child should contact us.',
      ],
    },
    {
      title: '8. International Data Transfers',
      content: [
        'Your information may be transferred to and processed in countries other than your country of residence.',
        'We ensure appropriate safeguards are in place for international transfers, including:',
        '• Standard contractual clauses',
        '• Data processing agreements',
        '• Compliance with applicable data protection laws',
      ],
    },
    {
      title: '9. Data Retention',
      content: [
        'We retain your personal data only as long as necessary for the purposes outlined in this policy.',
        'Account information is retained until you request deletion.',
        'Transaction records are retained for 7 years for legal and accounting purposes.',
        'Marketing data is retained until you unsubscribe.',
      ],
    },
    {
      title: '10. Changes to This Policy',
      content: [
        'We may update this privacy policy from time to time.',
        'We will notify you of material changes by:',
        '• Email notification',
        '• Prominent notice on our platform',
        'Continued use of our platform after changes constitutes acceptance of the updated policy.',
        'Last Updated: December 2024',
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh' }}>

      {/* Hero Section */}
      <Box
        className="privacy-hero"
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
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <SecurityIcon sx={{ fontSize: 80, color: '#667eea' }} />
          </Box>
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
            Privacy Policy
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '800px', mx: 'auto' }}
          >
            Your privacy is important to us. This policy explains how we collect, use, and
            protect your personal information.
          </Typography>
        </Container>
      </Box>

      {/* Summary Cards */}
      <Container sx={{ py: 8 }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ color: 'white', fontWeight: 700, mb: 2 }}
          >
            Privacy at a Glance
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 5, maxWidth: '700px', mx: 'auto' }}
          >
            We're committed to protecting your privacy and being transparent about our data practices
          </Typography>
        </MotionBox>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 8 }}>
          {[
            {
              icon: <VerifiedUserIcon sx={{ fontSize: 48 }} />,
              title: 'Never Sold',
              desc: 'We never sell your personal data to third parties',
            },
            {
              icon: <LockIcon sx={{ fontSize: 48 }} />,
              title: 'Encrypted',
              desc: 'All data is encrypted and stored securely with industry-standard protocols',
            },
            {
              icon: <SecurityIcon sx={{ fontSize: 48 }} />,
              title: 'Your Control',
              desc: 'You have full control over your data and can request deletion at any time',
            },
          ].map((item, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: 4,
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'rgba(102, 126, 234, 0.4)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
                  },
                }}
              >
                <Box sx={{ color: '#667eea', mb: 2 }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.7 }}>
                  {item.desc}
                </Typography>
              </Paper>
            </MotionBox>
          ))}
        </Box>

        {/* Table of Contents */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            sx={{
              p: 4,
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              mb: 6,
            }}
          >
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 3 }}>
              Table of Contents
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {sections.map((section, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateX(8px)',
                    },
                  }}
                  onClick={() => {
                    const element = document.getElementById(`section-${index}`);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#667eea',
                      flexShrink: 0,
                    }}
                  />
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                    {section.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </MotionBox>

        {/* Policy Sections */}
        <Box className="privacy-content">
          {sections.map((section, index) => (
            <MotionBox
              key={index}
              id={`section-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Paper
                sx={{
                  p: { xs: 3, md: 5 },
                  mb: 3,
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                  },
                  '&:hover': {
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    bgcolor: 'rgba(102, 126, 234, 0.03)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '1.3rem', md: '1.5rem' },
                  }}
                >
                  {section.title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {section.content.map((point, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      {point.startsWith('•') && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: '#667eea',
                            mt: 1,
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <Typography
                        sx={{
                          color: point.startsWith('•') || point.includes(':')
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(255, 255, 255, 0.7)',
                          lineHeight: 1.8,
                          fontSize: '1rem',
                          fontWeight: point.includes(':') ? 600 : 400,
                        }}
                      >
                        {point.replace('• ', '')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </MotionBox>
          ))}
        </Box>

        {/* Contact Section */}
        <Paper
          sx={{
            p: 4,
            bgcolor: 'rgba(102, 126, 234, 0.05)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Questions About Our Privacy Policy?
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
            If you have any questions or concerns about how we handle your data, we're here to
            help.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/contact')}
            sx={{
              px: 5,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                boxShadow: '0 12px 48px rgba(102, 126, 234, 0.6)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Contact Us
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
