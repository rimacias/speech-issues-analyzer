// User settings types and interfaces
export interface UserSettings {
  id?: string;
  userId: string;
  language: string;
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email: boolean;
    push: boolean;
    sessions: boolean;
    reports: boolean;
  };
  preferences?: {
    timezone?: string;
    dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    autoSave?: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserSettingsData {
  language?: string;
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email?: boolean;
    push?: boolean;
    sessions?: boolean;
    reports?: boolean;
  };
  preferences?: {
    timezone?: string;
    dateFormat?: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
    autoSave?: boolean;
  };
}
