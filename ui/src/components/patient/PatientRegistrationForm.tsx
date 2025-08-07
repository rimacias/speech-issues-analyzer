import React, { useState } from 'react';
import { CreatePatientData } from '@/types/patient';
import { usePatients } from '@/hooks/usePatients';
import { useLanguage } from '@/contexts/LanguageContext';
import Modal from '@/components/common/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface PatientRegistrationFormProps {
    isOpen: boolean;
    onSuccess?: (patient: any) => void;
    onCancel?: () => void;
}

export default function PatientRegistrationForm({ isOpen, onSuccess, onCancel }: PatientRegistrationFormProps) {
    const { createPatient, loading, error } = usePatients();
    const { t } = useLanguage();
    const [formData, setFormData] = useState<CreatePatientData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: new Date(),
        gender: 'other',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        medicalHistory: {
            allergies: [],
            medications: [],
            conditions: [],
            notes: ''
        }
    });

    const handleInputChange = (field: keyof CreatePatientData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAddressChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));
    };

    const handleMedicalHistoryChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            medicalHistory: { ...prev.medicalHistory, [field]: value }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newPatient = await createPatient(formData);
            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dateOfBirth: new Date(),
                gender: 'other',
                address: {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: ''
                },
                medicalHistory: {
                    allergies: [],
                    medications: [],
                    conditions: [],
                    notes: ''
                }
            });
            if (onSuccess) {
                onSuccess(newPatient);
            }
        } catch (err) {
            console.error('Error creating patient:', err);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onCancel || (() => {})}
            title={t('patient.registration')}
            size="xl"
            closeOnEscape={true}
            closeOnClickOutside={true}
        >
            <div className="p-6">
                {/* Custom header with icon */}
                <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
                    <FontAwesomeIcon icon={faUser} className="mr-3 text-blue-600 text-xl" />
                    <h2 className="text-xl font-semibold text-gray-900">{t('patient.registration')}</h2>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('patient.fields.firstName')} *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                placeholder={t('patient.placeholders.firstName')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('patient.fields.lastName')} *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                placeholder={t('patient.placeholders.lastName')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('patient.fields.email')} *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder={t('patient.placeholders.email')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('patient.fields.phone')}
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder={t('patient.placeholders.phone')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('patient.fields.dateOfBirth')} *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.dateOfBirth.toISOString().split('T')[0]}
                                onChange={(e) => handleInputChange('dateOfBirth', new Date(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('patient.fields.gender')} *
                            </label>
                            <select
                                required
                                value={formData.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="male">{t('patient.gender.male')}</option>
                                <option value="female">{t('patient.gender.female')}</option>
                                <option value="other">{t('patient.gender.other')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                            {t('patient.fields.address')} ({t('common.optional')})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('patient.fields.street')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.address?.street || ''}
                                    onChange={(e) => handleAddressChange('street', e.target.value)}
                                    placeholder={t('patient.placeholders.street')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('patient.fields.city')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.address?.city || ''}
                                    onChange={(e) => handleAddressChange('city', e.target.value)}
                                    placeholder={t('patient.placeholders.city')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('patient.fields.state')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.address?.state || ''}
                                    onChange={(e) => handleAddressChange('state', e.target.value)}
                                    placeholder={t('patient.placeholders.state')}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical History Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">
                            {t('patient.fields.medicalHistory')} ({t('common.optional')})
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('patient.fields.notes')}
                            </label>
                            <textarea
                                rows={3}
                                value={formData.medicalHistory?.notes || ''}
                                onChange={(e) => handleMedicalHistoryChange('notes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('patient.placeholders.notes')}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {t('common.cancel')}
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('common.loading') : t('patient.register')}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
