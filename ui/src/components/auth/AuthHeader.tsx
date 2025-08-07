interface AuthHeaderProps {
  isRegistering: boolean;
  onToggleMode: () => void;
}

export default function AuthHeader({ isRegistering, onToggleMode }: AuthHeaderProps) {
  return (
    <div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {isRegistering ? 'Create your account' : 'Sign in to your account'}
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {isRegistering
          ? 'Already have an account? '
          : 'Don\'t have an account? '}
        <button
          onClick={onToggleMode}
          className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
        >
          {isRegistering ? 'Sign in' : 'Register'}
        </button>
      </p>
    </div>
  );
}
