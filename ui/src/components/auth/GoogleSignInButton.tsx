import { FaGoogle } from 'react-icons/fa';
import Button from '@/components/ui/Button';

interface GoogleSignInButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function GoogleSignInButton({
  loading,
  disabled,
  onClick
}: GoogleSignInButtonProps) {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="secondary"
          size="md"
          loading={loading}
          loadingText="Signing in with Google..."
          disabled={disabled}
          onClick={onClick}
          className="w-full"
        >
          <div className="flex items-center">
            <FaGoogle className="w-5 h-5 mr-2 text-red-500" />
            Sign in with Google
          </div>
        </Button>
      </div>
    </div>
  );
}
