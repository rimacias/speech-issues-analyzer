import { useRouter } from 'next/navigation';
import { useLanguage } from "@/contexts/LanguageContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faGamepad, faFlask } from '@fortawesome/free-solid-svg-icons';

const NavigationButtons = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleResultsClick = () => {
    router.push('/results');
  };

  const handlePlayTestClick = () => {
    router.push('/game');
  };

  const handleTestLabClick = () => {
    router.push('/test-laboratory');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <button
        onClick={handleResultsClick}
        className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
      >
        <FontAwesomeIcon icon={faChartBar} className="w-8 h-8 mb-3" />
        <span className="text-lg font-semibold">{t('navigation.results')}</span>
        <span className="text-sm opacity-90 mt-1">{t('navigation.resultsDescription')}</span>
      </button>

      <button
        onClick={handlePlayTestClick}
        className="flex flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105"
      >
        <FontAwesomeIcon icon={faGamepad} className="w-8 h-8 mb-3" />
        <span className="text-lg font-semibold">{t('navigation.playTest')}</span>
        <span className="text-sm opacity-90 mt-1">{t('navigation.playTestDescription')}</span>
      </button>

      <button
        onClick={handleTestLabClick}
        className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition duration-200 ease-in-out transform hover:scale-105"
      >
        <FontAwesomeIcon icon={faFlask} className="w-8 h-8 mb-3" />
        <span className="text-lg font-semibold">{t('navigation.testLaboratory')}</span>
        <span className="text-sm opacity-90 mt-1">{t('navigation.testLaboratoryDescription')}</span>
      </button>
    </div>
  );
};

export default NavigationButtons;
