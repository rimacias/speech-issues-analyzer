interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({ title, description, className = "" }: FeatureCardProps) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
