import { useLanguage } from "@/contexts/LanguageContext";

const DashboardHeader = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {t('dashboard.welcome')}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {t('dashboard.description')}
      </p>
    </div>
  );
};

export default DashboardHeader;
