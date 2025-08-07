import DashboardHeader from "./DashboardHeader";
import FeatureGrid from "./FeatureGrid";
import NavigationButtons from "./NavigationButtons";

const DashboardContent = () => {
  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <DashboardHeader />
      <FeatureGrid />
      <NavigationButtons />
    </div>
  );
};

export default DashboardContent;
