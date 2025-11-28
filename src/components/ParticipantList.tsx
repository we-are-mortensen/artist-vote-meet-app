/**
 * Displays a list of participants as selectable options for voting
 */

import type { Participant } from '../types/poll.types';

type ParticipantListProps = {
  /** Array of participants to display */
  participants: Participant[];
  /** ID of the currently selected participant */
  selectedParticipantId: string;
  /** Callback when a participant is selected */
  onSelect: (participantId: string) => void;
  /** Whether the list is disabled (e.g., during submission) */
  disabled?: boolean;
  /** Whether to show loading state */
  loading?: boolean;
};

export default function ParticipantList({
  participants,
  selectedParticipantId,
  onSelect,
  disabled = false,
  loading = false,
}: ParticipantListProps) {
  if (loading) {
    return (
      <div className="participant-list-loading text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Carregant participants...
        </p>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="participant-list-empty text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          No hi ha participants disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="participant-list space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Selecciona un participant:
      </p>
      {participants.map((participant) => {
        const isSelected = selectedParticipantId === participant.id;
        return (
          <label
            key={participant.id}
            className={`
              participant-option
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
              name="participant"
              value={participant.id}
              checked={isSelected}
              onChange={() => onSelect(participant.id)}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              aria-label={`Votar per ${participant.name}`}
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
              {participant.name}
            </span>
          </label>
        );
      })}
    </div>
  );
}
