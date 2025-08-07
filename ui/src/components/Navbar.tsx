'use client';

import {useAuth} from '@/lib/auth-context';
import {useState, useRef, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faUser, faCog, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import {useTranslation} from 'react-i18next';

const Navbar = () => {
    const {user, logout} = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const {t} = useTranslation();

    const handleLogout = async () => {
        try {
            await logout();
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleProfileClick = () => {
        router.push('/profile');
        setIsDropdownOpen(false);
    };

    const handleSettingsClick = () => {
        router.push('/settings');
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white shadow-lg border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {t('navbar.title')}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-3 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md px-3 py-2 transition duration-150 ease-in-out"
                                >
                                    {user.photoURL && (
                                        <img
                                            className="h-8 w-8 rounded-full"
                                            src={user.photoURL}
                                            alt={user.displayName || 'User avatar'}
                                        />
                                    )}
                                    <span>{user.displayName || user.email}</span>
                                    <FontAwesomeIcon
                                        icon={faChevronDown}
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                            isDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {isDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                                        <button
                                            onClick={handleProfileClick}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                                        >
                                            <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3"/>
                                            {t('navbar.profile')}
                                        </button>
                                        <button
                                            onClick={handleSettingsClick}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-150 ease-in-out"
                                        >
                                            <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-3"/>
                                            {t('navbar.settings')}
                                        </button>
                                        <hr className="my-1 border-gray-200"/>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition duration-150 ease-in-out"
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3"/>
                                            {t('navbar.signOut')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
