'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUsers, setLoading, setError, setPage } from '@/store/slices/usersSlice';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { users, isLoading, error, totalCount, currentPage, pageSize } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Fetch users - replace with actual GraphQL query
    const fetchUsers = async () => {
      dispatch(setLoading(true));
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data - replace with actual GraphQL query
        const mockUsers = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'admin',
            status: 'active' as const,
            createdAt: '2024-01-15',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'user',
            status: 'active' as const,
            createdAt: '2024-02-20',
          },
          {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'user',
            status: 'inactive' as const,
            createdAt: '2024-03-10',
          },
          {
            id: '4',
            name: 'Alice Williams',
            email: 'alice@example.com',
            role: 'moderator',
            status: 'pending' as const,
            createdAt: '2024-03-25',
          },
        ];

        dispatch(setUsers({ users: mockUsers, totalCount: mockUsers.length }));
      } catch (err: any) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated, dispatch, currentPage, pageSize]);

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleEdit = (userId: string) => {
    console.log('Edit user:', userId);
    // Implement edit functionality
  };

  const handleDelete = (userId: string) => {
    console.log('Delete user:', userId);
    // Implement delete functionality
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Users Management</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add User
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.role} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.status}
                          size="small"
                          color={getStatusColor(user.status)}
                        />
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(user.id)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalCount}
              page={currentPage - 1}
              onPageChange={handleChangePage}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[10]}
            />
          </Paper>
        )}
      </Box>
    </DashboardLayout>
  );
}
