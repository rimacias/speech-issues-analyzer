export interface Patient {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  medicalHistory?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    notes?: string;
  };
  speechIssues?: {
    type: string;
    severity: 'mild' | 'moderate' | 'severe';
    description?: string;
    dateReported: Date;
  }[];
  sessions?: string[]; // Array of session IDs
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  medicalHistory?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    notes?: string;
  };
}

export interface UpdatePatientData extends Partial<CreatePatientData> {
  speechIssues?: {
    type: string;
    severity: 'mild' | 'moderate' | 'severe';
    description?: string;
    dateReported: Date;
  }[];
  isActive?: boolean;
}
