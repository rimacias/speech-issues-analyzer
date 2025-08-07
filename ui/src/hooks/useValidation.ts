import {useLanguage} from '@/contexts/LanguageContext';

export interface ValidationRule {
    required?: boolean;
    email?: boolean;
    phone?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
    customMessage?: string;
}

export interface ValidationErrors {
    [key: string]: string;
}

export const useValidation = () => {
    const {t} = useLanguage();

    const validateField = (value: any, rules: ValidationRule): string | null => {
        // Required validation
        if (rules.required && (!value || value.toString().trim() === '')) {
            return t('validation.required');
        }

        // Skip other validations if field is empty and not required
        if (!value || value.toString().trim() === '') {
            return null;
        }

        // Email validation
        if (rules.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return t('validation.email');
            }
        }

        // Phone validation
        if (rules.phone) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                return t('validation.phone');
            }
        }

        // Min length validation
        if (rules.minLength && value.toString().length < rules.minLength) {
            return t('validation.minLength', {count: rules.minLength});
        }

        // Max length validation
        if (rules.maxLength && value.toString().length > rules.maxLength) {
            return t('validation.maxLength', {count: rules.maxLength});
        }

        // Pattern validation
        if (rules.pattern && !rules.pattern.test(value)) {
            return rules.customMessage || t('validation.required');
        }

        // Custom validation
        if (rules.custom && !rules.custom(value)) {
            return rules.customMessage || t('validation.required');
        }

        return null;
    };

    const validateForm = (
        data: Record<string, any>,
        validationRules: Record<string, ValidationRule>
    ): ValidationErrors => {
        const errors: ValidationErrors = {};

        Object.keys(validationRules).forEach(field => {
            const error = validateField(data[field], validationRules[field]);
            if (error) {
                errors[field] = error;
            }
        });

        return errors;
    };

    const validateDateNotFuture = (date: Date): string | null => {
        if (date > new Date()) {
            return t('validation.futureDate');
        }
        return null;
    };

    const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
        if (password !== confirmPassword) {
            return t('validation.passwordMismatch');
        }
        return null;
    };

    return {
        validateField,
        validateForm,
        validateDateNotFuture,
        validatePasswordMatch
    };
};
