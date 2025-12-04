import { gql } from '@apollo/client';

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalUsers
      totalOrders
      revenue
      growth
    }
  }
`;

export const GET_RECENT_ACTIVITIES = gql`
  query GetRecentActivities($limit: Int) {
    recentActivities(limit: $limit) {
      id
      type
      description
      timestamp
      user
    }
  }
`;

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    dashboardStats {
      totalUsers
      totalOrders
      revenue
      growth
    }
    recentActivities(limit: 10) {
      id
      type
      description
      timestamp
      user
    }
  }
`;
