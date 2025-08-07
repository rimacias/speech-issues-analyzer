import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  signInWithGoogle,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword
} from '@/lib/firebase';
import { useToast } from '@/components/providers/ToastProvider';

export function useAuthForm() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegistering) {
        await registerWithEmailAndPassword(email, password);
        success('Account created successfully! Welcome aboard!', 'Registration Complete');
      } else {
        await loginWithEmailAndPassword(email, password);
        success('Welcome back!', 'Signed In');
      }
      router.push('/');
    } catch (err: any) {
      showError(err.message || 'An error occurred during authentication', 'Authentication Error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      success('Successfully signed in with Google!', 'Welcome');
      router.push('/');
    } catch (err: any) {
      // Enhanced error handling with more detailed logging
      console.log('Google sign-in error caught:', {
        name: err.name,
        code: err.code,
        message: err.message,
        error: err
      });

      // Handle the custom cancellation error from Firebase
      if (err.name === 'UserCancellation') {
        console.log('User cancelled Google sign-in - this is normal behavior');
        return; // Silent return, no error shown
      }

      // Handle original Firebase cancellation errors as backup
      const isCancellation =
        err.code === 'auth/popup-closed-by-user' ||
        err.code === 'auth/cancelled-popup-request' ||
        err.code === 'auth/popup-blocked' ||
        err.code === 'auth/user-cancelled' ||
        err.message?.toLowerCase().includes('popup') ||
        err.message?.toLowerCase().includes('cancelled') ||
        err.message?.toLowerCase().includes('closed') ||
        err.message?.toLowerCase().includes('user') ||
        String(err).toLowerCase().includes('popup') ||
        String(err).toLowerCase().includes('cancelled');

      if (isCancellation) {
        console.log('User cancelled Google sign-in - this is normal behavior');
        return; // Silent return, no error shown
      }

      // Show error for actual authentication failures
      console.error('Actual Google sign-in error:', err);
      showError(err.message || 'An error occurred during Google authentication', 'Google Sign-In Error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  return {
    // State
    email,
    password,
    isRegistering,
    loading,
    googleLoading,

    // Setters
    setEmail,
    setPassword,

    // Actions
    handleEmailSubmit,
    handleGoogleSignIn,
    toggleMode,

    // Computed
    isAnyLoading: loading || googleLoading
  };
}
