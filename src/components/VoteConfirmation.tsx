/**
 * Displays confirmation message after a vote has been successfully cast
 * Shows which option was voted for and waiting message
 */

type VoteConfirmationProps = {
  /** Name of the option that was voted for */
  votedForName: string;
};

export default function VoteConfirmation({ votedForName }: VoteConfirmationProps) {
  return (
    <div className="vote-confirmation bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-6 text-center">
      {/* Success icon */}
      <div className="mb-4 flex justify-center">
        <svg
          className="h-16 w-16 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Success message */}
      <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
        Vot enviat correctament!
      </h2>

      {/* Voted for message */}
      <p className="text-base text-green-700 dark:text-green-300 mb-4">
        Has votat per: <span className="font-semibold">{votedForName}</span>
      </p>

      {/* Waiting message */}
      <div className="pt-4 border-t border-green-300 dark:border-green-700">
        <p className="text-sm text-green-600 dark:text-green-400">
          Esperant la resta de vots...
        </p>
        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
          Els resultats es mostraran a la pantalla principal
        </p>
      </div>

      {/* Loading animation */}
      <div className="mt-4 flex justify-center">
        <div className="flex space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
