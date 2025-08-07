import { useState } from "react";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import PatientRegistrationForm from "@/components/patient/PatientRegistrationForm";
import { useLanguage } from "@/contexts/LanguageContext";

const PatientFormModal = () => {
  const { t } = useLanguage();
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);

  const handlePatientSuccess = (patient: any) => {
    console.log('Patient created successfully:', patient);
    setIsPatientFormOpen(false);
  };

  const handlePatientCancel = () => {
    setIsPatientFormOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => setIsPatientFormOpen(true)}
        tooltip={t('patient.register')}
      />

      {/* Patient Registration Form with built-in Modal */}
      <PatientRegistrationForm
        isOpen={isPatientFormOpen}
        onSuccess={handlePatientSuccess}
        onCancel={handlePatientCancel}
      />
    </>
  );
};

export default PatientFormModal;
