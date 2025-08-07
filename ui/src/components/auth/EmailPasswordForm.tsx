import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import React from "react";

interface EmailPasswordFormProps {
  email: string;
  password: string;
  isRegistering: boolean;
  loading: boolean;
  disabled: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EmailPasswordForm({
  email,
  password,
  isRegistering,
  loading,
  disabled,
  onEmailChange,
  onPasswordChange,
  onSubmit
}: EmailPasswordFormProps) {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <input type="hidden" name="remember" defaultValue="true" />

      <div className="rounded-md shadow-sm -space-y-px">
        <Input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-none rounded-t-md"
          placeholder="Email address"
          label="Email address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />

        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={isRegistering ? 'new-password' : 'current-password'}
          required
          className="rounded-none rounded-b-md"
          placeholder="Password"
          label="Password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </div>

      {!isRegistering && (
        <div className="flex items-center justify-end">
          <div className="text-sm">
            <Link
              href="/reset-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={loading}
        loadingText={isRegistering ? 'Creating account...' : 'Signing in...'}
        disabled={disabled}
        className="w-full"
      >
        {isRegistering ? 'Register' : 'Sign in'}
      </Button>
    </form>
  );
}
