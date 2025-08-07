import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import {db} from './firebase';
import type {UserSettings, UpdateUserSettingsData} from '@/types/settings';

const COLLECTION_NAME = 'users';

export class UserSettingsService {
    /**
     * Get user settings by user ID
     */
    static async getUserSettings(userId: string): Promise<UserSettings | null> {
        try {
            console.log('UserSettingsService: Getting user settings for:', userId);
            const docRef = doc(db, COLLECTION_NAME, userId);
            const docSnap = await getDoc(docRef);
            console.log('UserSettingsService: Document exists:', docSnap.exists());

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log('UserSettingsService: Document data:', data);
                return {
                    id: docSnap.id,
                    userId: data.userId || userId,
                    language: data.language || 'en',
                    theme: data.theme || 'light',
                    notifications: data.notifications || {
                        email: true,
                        push: true,
                        sessions: true,
                        reports: true
                    },
                    preferences: data.preferences || {
                        timezone: 'UTC',
                        dateFormat: 'MM/DD/YYYY',
                        autoSave: true
                    },
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date()
                };
            }

            console.log('UserSettingsService: No document found, creating default settings');
            // Automatically create default settings when none exist
            return await this.createUserSettings(userId);
        } catch (error) {
            console.error('UserSettingsService: Error getting user settings:', error);
            throw new Error('Failed to retrieve user settings');
        }
    }

    /**
     * Create default user settings
     */
    static async createUserSettings(userId: string, language: string = 'en'): Promise<UserSettings> {
        try {
            const now = new Date();
            const defaultSettings: Omit<UserSettings, 'id'> = {
                userId,
                language,
                theme: 'light',
                notifications: {
                    email: true,
                    push: true,
                    sessions: true,
                    reports: true
                },
                preferences: {
                    timezone: 'UTC',
                    dateFormat: 'MM/DD/YYYY',
                    autoSave: true
                },
                createdAt: now,
                updatedAt: now
            };

            const docRef = doc(db, COLLECTION_NAME, userId);
            await setDoc(docRef, {
                ...defaultSettings,
                createdAt: Timestamp.fromDate(now),
                updatedAt: Timestamp.fromDate(now)
            });

            return {
                id: userId,
                ...defaultSettings
            };
        } catch (error) {
            console.error('Error creating user settings:', error);
            throw new Error('Failed to create user settings');
        }
    }

    /**
     * Update user settings
     */
    static async updateUserSettings(userId: string, updateData: UpdateUserSettingsData): Promise<UserSettings> {
        try {
            const docRef = doc(db, COLLECTION_NAME, userId);

            // Get existing settings (this will create defaults if none exist)
            const existingSettings = await this.getUserSettings(userId);
            if (!existingSettings) {
                throw new Error('Failed to get or create user settings');
            }

            const updatePayload = {
                ...updateData,
                updatedAt: Timestamp.fromDate(new Date())
            };

            await updateDoc(docRef, updatePayload);

            const updatedSettings = await this.getUserSettings(userId);
            if (!updatedSettings) {
                throw new Error('Failed to retrieve updated settings');
            }

            return updatedSettings;
        } catch (error) {
            console.error('Error updating user settings:', error);
            throw new Error('Failed to update user settings');
        }
    }

    /**
     * Update only the language setting
     */
    static async updateUserLanguage(userId: string, language: string): Promise<UserSettings> {
        return this.updateUserSettings(userId, {language});
    }
}
