'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { restoreAuth, logout, initializeAuth } from '@/store/slices/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Restore authentication from localStorage
    const restoreSession = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const tokenExpiry = localStorage.getItem('tokenExpiry');

        // Check if token exists and hasn't expired
        if (token && userStr && tokenExpiry) {
          const expiryTime = parseInt(tokenExpiry, 10);
          const now = Date.now();

          if (now < expiryTime) {
            // Token is still valid
            const user = JSON.parse(userStr);
            dispatch(restoreAuth({ user, token }));

            // Set up auto-logout when token expires
            const timeUntilExpiry = expiryTime - now;
            setTimeout(() => {
              handleAutoLogout();
            }, timeUntilExpiry);
          } else {
            // Token has expired
            handleAutoLogout();
          }
        } else {
          // No session to restore
          dispatch(initializeAuth());
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        dispatch(initializeAuth());
      }
    };

    const handleAutoLogout = () => {
      dispatch(logout());
      router.push('/login?expired=true');
    };

    // Restore session on mount
    if (!isInitialized) {
      restoreSession();
    }

    // Check token expiry periodically (every 5 minutes)
    const intervalId = setInterval(() => {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry, 10);
        const now = Date.now();

        if (now >= expiryTime) {
          handleAutoLogout();
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [dispatch, router, isInitialized]);

  return <>{children}</>;
}
