"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FaSpinner } from 'react-icons/fa';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/reset-password'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';

  useEffect(() => {
    // Don't do anything while auth is loading
    if (loading) return;

    // If the user is not logged in and trying to access a protected route, redirect to login
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }

    // If the user is logged in and trying to access login or reset password, redirect to home
    if (user && publicRoutes.includes(pathname)) {
      router.push('/');
    }
  }, [user, loading, router, pathname]);

  // Show loading state if authentication is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  // If the route requires authentication and user is not logged in, return null (will redirect)
  if (!user && !publicRoutes.includes(pathname)) {
    return null;
  }

  // Otherwise render the children
  return <>{children}</>;
}
