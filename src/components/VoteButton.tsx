/**
 * Button component for submitting votes
 * Displays "Enviar vot" (Send vote) in Catalan
 */

type VoteButtonProps = {
  /** Click handler for vote submission */
  onClick: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Whether the button is in loading/submitting state */
  loading?: boolean;
};

export default function VoteButton({
  onClick,
  disabled = false,
  loading = false,
}: VoteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label="Enviar el meu vot"
      className={`
        vote-button w-full py-3 px-6 rounded-lg font-semibold text-white text-base
        transition-all duration-200
        ${
          disabled || loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
        }
        flex items-center justify-center gap-2
      `}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
          <span>Enviant vot...</span>
        </>
      ) : (
        <span>Enviar vot</span>
      )}
    </button>
  );
}
