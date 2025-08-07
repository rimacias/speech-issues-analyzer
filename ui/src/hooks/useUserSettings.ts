import { useState, useEffect, useCallback } from 'react';
import { UserSettings, UpdateUserSettingsData } from '@/types/settings';
import { UserSettingsService } from '@/lib/user-settings-service';
import { useAuth } from '@/lib/auth-context';

export const useUserSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    if (!user?.uid) {
      console.log('No user ID available, skipping settings load');
      return;
    }

    console.log('Loading settings for user:', user.uid);
    setLoading(true);
    setError(null);
    try {
      // getUserSettings now automatically creates default settings if none exist
      const userSettings = await UserSettingsService.getUserSettings(user.uid);

      setSettings(userSettings);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      console.log('Finished loading settings, setting loading to false');
      setLoading(false);
    }
  }, [user?.uid]);

  const updateSettings = useCallback(async (updateData: UpdateUserSettingsData): Promise<boolean> => {
    if (!user?.uid) return false;

    setLoading(true);
    setError(null);
    try {
      const updatedSettings = await UserSettingsService.updateUserSettings(user.uid, updateData);
      setSettings(updatedSettings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const updateLanguage = useCallback(async (language: string): Promise<boolean> => {
    if (!user?.uid) return false;

    setLoading(true);
    setError(null);
    try {
      const updatedSettings = await UserSettingsService.updateUserLanguage(user.uid, language);
      setSettings(updatedSettings);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update language');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      loadSettings();
    } else {
      setSettings(null);
    }
  }, [user?.uid, loadSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateLanguage,
    refreshSettings: loadSettings
  };
};
