/**
 * Displays a list of poll options as selectable choices for voting
 */

import type { PollOption } from '../types/poll.types';

type OptionListProps = {
  /** Array of poll options to display */
  options: PollOption[];
  /** ID of the currently selected option */
  selectedOptionId: string;
  /** Callback when an option is selected */
  onSelect: (optionId: string) => void;
  /** Whether the list is disabled (e.g., during submission) */
  disabled?: boolean;
  /** Whether to show loading state */
  loading?: boolean;
};

export default function OptionList({
  options,
  selectedOptionId,
  onSelect,
  disabled = false,
  loading = false,
}: OptionListProps) {
  if (loading) {
    return (
      <div className="option-list-loading text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Carregant opcions...
        </p>
      </div>
    );
  }

  if (options.length === 0) {
    return (
      <div className="option-list-empty text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No hi ha opcions disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="option-list space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Selecciona una opció:
      </p>
      {options.map((option) => {
        const isSelected = selectedOptionId === option.id;
        return (
          <label
            key={option.id}
            className={`
              poll-option
              flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500'
              }
              ${
                disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-md'
              }
            `}
          >
            <input
              type="radio"
              name="poll-option"
              value={option.id}
              checked={isSelected}
              onChange={() => onSelect(option.id)}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              aria-label={`Votar per ${option.name}`}
            />
            <span
              className={`
                ml-3 text-base font-medium
                ${
                  isSelected
                    ? 'text-blue-900 dark:text-blue-100'
                    : 'text-gray-900 dark:text-gray-100'
                }
              `}
            >
              {option.name}
            </span>
          </label>
        );
      })}
    </div>
  );
}
