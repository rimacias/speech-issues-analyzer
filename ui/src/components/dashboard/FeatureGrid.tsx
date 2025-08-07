import { useLanguage } from "@/contexts/LanguageContext";
import FeatureCard from "./FeatureCard";

const FeatureGrid = () => {
  const { t } = useLanguage();

  const features = [
    {
      titleKey: 'dashboard.features.recordAnalysis.title',
      descriptionKey: 'dashboard.features.recordAnalysis.description'
    },
    {
      titleKey: 'dashboard.features.realtimeFeedback.title',
      descriptionKey: 'dashboard.features.realtimeFeedback.description'
    },
    {
      titleKey: 'dashboard.features.progressTracking.title',
      descriptionKey: 'dashboard.features.progressTracking.description'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          title={t(feature.titleKey)}
          description={t(feature.descriptionKey)}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
