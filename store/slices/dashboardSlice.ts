import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  revenue: string;
  growth: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface DashboardState {
  stats: DashboardStats;
  recentActivities: Activity[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalUsers: 0,
    totalOrders: 0,
    revenue: '$0',
    growth: '0%',
  },
  recentActivities: [],
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
    },
    setActivities: (state, action: PayloadAction<Activity[]>) => {
      state.recentActivities = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.recentActivities.unshift(action.payload);
    },
  },
});

export const {
  setStats,
  setActivities,
  setLoading,
  setError,
  addActivity,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
