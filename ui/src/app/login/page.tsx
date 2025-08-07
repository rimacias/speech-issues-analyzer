"use client";

import { useAuthForm } from '@/hooks/useAuthForm';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthHeader from '@/components/auth/AuthHeader';
import EmailPasswordForm from '@/components/auth/EmailPasswordForm';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export default function LoginPage() {
  const {
    email,
    password,
    isRegistering,
    loading,
    googleLoading,
    setEmail,
    setPassword,
    handleEmailSubmit,
    handleGoogleSignIn,
    toggleMode,
    isAnyLoading
  } = useAuthForm();

  return (
    <AuthLayout>
      <AuthHeader 
        isRegistering={isRegistering} 
        onToggleMode={toggleMode} 
      />

      <EmailPasswordForm
        email={email}
        password={password}
        isRegistering={isRegistering}
        loading={loading}
        disabled={isAnyLoading}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleEmailSubmit}
      />

      <GoogleSignInButton
        loading={googleLoading}
        disabled={isAnyLoading}
        onClick={handleGoogleSignIn}
      />
    </AuthLayout>
  );
}
