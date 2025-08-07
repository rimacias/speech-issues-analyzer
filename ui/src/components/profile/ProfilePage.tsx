'use client';

import React, {useState} from 'react';
import {useLanguage} from '@/contexts/LanguageContext';
import {useUserSettings} from '@/hooks/useUserSettings';
import {useAuth} from "@/lib/auth-context";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export default function ProfilePage() {
    const {t} = useLanguage();
    const {user} = useAuth();
    const {settings, loading, error} = useUserSettings();
    const [isEditing, setIsEditing] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">{t('auth.signIn')}</p>
                </div>
            </div>
        );
    }

    // Get user initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const displayName = user.displayName || user.email || 'User';
    const initials = getInitials(displayName);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    {t('profile.description')}
                                </p>
                            </div>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                title={t('common.back')}
                            >
                                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                                {t('common.back')}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Profile Information */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-medium text-gray-900">{t('profile.personalInfo')}</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    {isEditing ? t('common.cancel') : t('common.edit')}
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-6">
                            <div className="flex items-center space-x-6 mb-6">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {user.photoURL ? (
                                        <img
                                            className="h-20 w-20 rounded-full object-cover"
                                            src={user.photoURL}
                                            alt={displayName}
                                        />
                                    ) : (
                                        <div
                                            className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-xl font-medium text-white">
                        {initials}
                      </span>
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {displayName}
                                    </h3>
                                    <p className="text-gray-600">{user.email}</p>
                                    {user.emailVerified && (
                                        <span
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"/>
                      </svg>
                                            {t('profile.verified')}
                    </span>
                                    )}
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('profile.displayName')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.displayName || t('profile.notSet')}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('patient.fields.email')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('profile.accountCreated')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.metadata.creationTime ?
                                            new Date(user.metadata.creationTime).toLocaleDateString() :
                                            t('profile.unknown')
                                        }
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {t('profile.lastSignIn')}
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {user.metadata.lastSignInTime ?
                                            new Date(user.metadata.lastSignInTime).toLocaleDateString() :
                                            t('profile.unknown')
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Settings Summary */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">{t('profile.accountSettings')}</h2>
                            {loading && (
                                <p className="text-sm text-gray-500">{t('common.loading')}</p>
                            )}
                            {error && (
                                <p className="text-sm text-red-600">{t('common.error')}: {error}</p>
                            )}
                        </div>

                        <div className="px-6 py-6">
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Loading skeleton */}
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="animate-pulse">
                                            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('settings.language')}
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {settings?.language === 'es' ? 'Español' : 'English'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('settings.theme')}
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {settings?.theme ? t(`settings.themes.${settings.theme}`) : t('settings.themes.light')}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('settings.preferences.dateFormat')}
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {settings?.preferences?.dateFormat || 'MM/DD/YYYY'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('settings.preferences.autoSave')}
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {settings?.preferences?.autoSave ? t('profile.enabled') : t('profile.disabled')}
                                        </p>
                                    </div>

                                    {/* Notifications */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('settings.notificationTypes.email')}
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {settings?.notifications?.email ? t('profile.enabled') : t('profile.disabled')}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            {t('settings.notificationTypes.push')}
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">
                                            {settings?.notifications?.push ? t('profile.enabled') : t('profile.disabled')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="/settings"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        {t('navigation.settings')}
                                    </a>

                                    {!settings && !loading && (
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor"
                                                 viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                            </svg>
                                            {t('common.tryAgain')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Information */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">{t('profile.security')}</h2>
                        </div>

                        <div className="px-6 py-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{t('profile.emailVerification')}</h4>
                                        <p className="text-sm text-gray-500">
                                            {user.emailVerified ?
                                                t('profile.emailVerified') :
                                                t('profile.emailNotVerified')
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        {user.emailVerified ? (
                                            <span
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t('profile.verified')}
                      </span>
                                        ) : (
                                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                {t('profile.verifyEmail')}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{t('profile.authMethod')}</h4>
                                        <p className="text-sm text-gray-500">
                                            {user.providerData[0]?.providerId === 'google.com' ?
                                                t('profile.googleSignIn') :
                                                t('profile.emailPassword')
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
