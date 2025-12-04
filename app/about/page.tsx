'use client';

import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

export default function AboutPage() {
  const router = useRouter();

  useGSAP(() => {
    gsap.from('.about-hero', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.about-card', {
      scrollTrigger: {
        trigger: '.about-values',
        start: 'top 80%',
      },
      y: 80,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.about-stat', {
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 80%',
      },
      scale: 0.5,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });
  }, []);

  const values = [
    {
      icon: <RocketLaunchIcon sx={{ fontSize: 48 }} />,
      title: 'Innovation First',
      desc: 'We constantly evolve our platform with cutting-edge technology to provide the best shopping experience.',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 48 }} />,
      title: 'Trust & Security',
      desc: 'Your data security is our top priority. We use enterprise-grade encryption and secure payment gateways.',
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 48 }} />,
      title: 'Customer Delight',
      desc: 'Every decision we make is centered around creating delightful experiences for our customers.',
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 48 }} />,
      title: 'Community Driven',
      desc: 'We build features based on real customer feedback and constantly improve based on your needs.',
    },
  ];

  const stats = [
    { number: '1M+', label: 'Happy Customers' },
    { number: '50K+', label: 'Products Listed' },
    { number: '99.9%', label: 'Uptime SLA' },
    { number: '24/7', label: 'Customer Support' },
  ];

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh' }}>

      {/* Hero Section */}
      <Box
        className="about-hero"
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
            About NovaCart
          </Typography>
          <Typography
            variant="h5"
            align="center"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            Your trusted e-commerce partner
          </Typography>
        </Container>
      </Box>

      {/* Story Section */}
      <Container sx={{ py: 10 }}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{ color: 'white', fontWeight: 700, mb: 6 }}
          >
            Our Story
          </Typography>
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              bgcolor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}
            >
              Founded in 2024, NovaCart was born from a simple idea: online shopping should be
              fast, secure, and delightful. We noticed that many e-commerce platforms were either
              too complex or lacked the modern features customers expected.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 }}
            >
              Our team of passionate developers, designers, and e-commerce experts came together
              to build a platform that combines cutting-edge technology with user-friendly design.
              We leverage React, GraphQL, and modern web technologies to deliver lightning-fast
              performance and a seamless shopping experience.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem', lineHeight: 1.8 }}
            >
              Today, NovaCart serves over 1 million happy customers, offering 50,000+ products
              from verified sellers. We're committed to continuous innovation and putting our
              customers first in everything we do.
            </Typography>
          </Paper>
        </MotionBox>
      </Container>

      {/* Stats Section */}
      <Box className="about-stats" sx={{ bgcolor: 'rgba(102, 126, 234, 0.05)', py: 10 }}>
        <Container>
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <MotionBox
                  className="about-stat"
                  sx={{ textAlign: 'center' }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      color: '#667eea',
                      mb: 1,
                      fontSize: { xs: '2rem', md: '3rem' },
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    {stat.label}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box
        className="about-values"
        sx={{
          py: 10,
          position: 'relative',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />

        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ mb: 8, textAlign: 'center' }}
          >
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Our Core Values
            </Typography>
            <Box
              sx={{
                width: 100,
                height: 4,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                mx: 'auto',
                mb: 3,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              The principles that guide everything we do
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <MotionPaper
                  className="about-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -12,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  sx={{
                    p: 4,
                    height: '100%',
                    background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      borderColor: 'rgba(102, 126, 234, 0.4)',
                      background: 'linear-gradient(145deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                      boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
                      '&::before': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  {/* Icon container with animated background */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        zIndex: 1,
                        color: '#667eea',
                        display: 'flex',
                        transition: 'color 0.3s ease',
                        '.about-card:hover &': {
                          color: 'white',
                        },
                      }}
                    >
                      {value.icon}
                    </Box>
                  </Box>

                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      fontSize: { xs: '1.3rem', md: '1.5rem' },
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.8,
                      fontSize: '0.95rem',
                    }}
                  >
                    {value.desc}
                  </Typography>

                  {/* Decorative corner accent */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 0.1) 50%)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '.about-card:hover &': {
                        opacity: 1,
                      },
                    }}
                  />
                </MotionPaper>
              </Grid>
            ))}
          </Grid>

          {/* Additional emphasis section */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{ mt: 8 }}
          >
            <Paper
              sx={{
                p: 5,
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: 4,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                }}
              >
                These values aren't just words on a page
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  maxWidth: '700px',
                  mx: 'auto',
                  lineHeight: 1.8,
                }}
              >
                They're the foundation of how we build our platform, interact with customers,
                and make decisions every single day. When you shop with NovaCart, you're not
                just buying products – you're joining a community built on trust, innovation,
                and genuine care.
              </Typography>
            </Paper>
          </MotionBox>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Container sx={{ textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{ color: 'white', fontWeight: 800, mb: 3 }}
          >
            Join Our Growing Community
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 5 }}
          >
            Start shopping with NovaCart today and experience the difference
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/products')}
              sx={{
                px: 5,
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
              Start Shopping
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/contact')}
              sx={{
                px: 5,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'white',
                borderColor: 'white',
                borderRadius: '50px',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#667eea',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
