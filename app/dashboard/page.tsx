'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setStats } from '@/store/slices/dashboardSlice';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { stats } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Simulate fetching dashboard stats from GraphQL
    // Replace with actual GraphQL query when backend is ready
    const fetchStats = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(setStats({
        totalUsers: 1234,
        totalOrders: 567,
        revenue: '$12,345',
        growth: '+23%',
      }));
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const statsDisplay = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: <ShoppingCartIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
    },
    {
      title: 'Revenue',
      value: stats.revenue,
      icon: <AttachMoneyIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
    },
    {
      title: 'Growth',
      value: stats.growth,
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
    },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Welcome back, {user.name}!
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {statsDisplay.map((stat, index) => (
            <Grid item size={{xs:12,sm:6,md:3 }} key={index}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h5">{stat.value}</Typography>
                    </Box>
                    <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item size={{xs:12,md:8}}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography color="text.secondary">
                Your recent activity will appear here.
              </Typography>
            </Paper>
          </Grid>
          <Grid item size={{xs:12,md:4}}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography color="text.secondary">
                Quick action items will appear here.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
