'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { signInWithGoogle } from '@/lib/firebase';
import { FaGoogle, FaSpinner } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {t('auth.welcome')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('auth.pleaseSignIn')}
            </p>
          </div>
          <div className="mt-8">
            <button
              onClick={signInWithGoogle}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <span className="flex items-center">
                <FaGoogle className="w-5 h-5 mr-2" />
                {t('auth.signInWithGoogle')}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthLayout;
