'use client';

import { useEffect, useState } from 'react';
import {
  meet,
  MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { CLOUD_PROJECT_NUMBER } from '../../shared/constants';
import type { Participant, Vote, PollState, PollMessage } from '../../types/poll.types';
import { generateParticipantId, isValidParticipantName } from '../../utils/voteCalculations';
import PollQuestion from '../../components/PollQuestion';
import ParticipantList from '../../components/ParticipantList';
import VoteButton from '../../components/VoteButton';
import VoteConfirmation from '../../components/VoteConfirmation';

/**
 * Activity side panel for voting
 * Each participant registers themselves and casts their vote
 * @see {@link https://developers.google.com/meet/add-ons/guides/overview#side-panel}
 */
export default function Page() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();
  const [pollState, setPollState] = useState<PollState | null>(null);

  // Participant registration
  const [participantName, setParticipantName] = useState('');
  const [participantId, setParticipantId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Voting state
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [votedForName, setVotedForName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Registers the participant and notifies main stage
   */
  async function handleRegistration(e: React.FormEvent) {
    e.preventDefault();

    if (!sidePanelClient || !pollState) {
      return;
    }

    if (!isValidParticipantName(participantName)) {
      alert('Si us plau, introdueix un nom vàlid (1-50 caràcters)');
      return;
    }

    const newParticipant: Participant = {
      id: generateParticipantId(),
      name: participantName.trim(),
    };

    setParticipantId(newParticipant.id);
    setIsRegistered(true);

    // Add to local state immediately
    setPollState((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: [...prev.participants, newParticipant],
      };
    });

    // Notify main stage and other side panels about new participant
    const message: PollMessage = {
      type: 'PARTICIPANT_JOINED',
      payload: newParticipant,
      timestamp: Date.now(),
    };

    await sidePanelClient.notifyMainStage(JSON.stringify(message));
  }

  /**
   * Handles vote submission
   */
  async function handleVoteSubmit() {
    if (!sidePanelClient || !selectedParticipantId || !pollState) {
      return;
    }

    if (!selectedParticipantId) {
      alert('Si us plau, selecciona un participant');
      return;
    }

    setIsSubmitting(true);

    try {
      const vote: Vote = {
        voterId: participantId,
        voterName: participantName,
        selectedParticipantId,
        timestamp: Date.now(),
      };

      // Find the name of who was voted for
      const votedFor = pollState.participants.find(
        (p) => p.id === selectedParticipantId
      );
      setVotedForName(votedFor?.name || 'Desconegut');

      // Notify main stage about the vote
      const message: PollMessage = {
        type: 'VOTE_CAST',
        payload: vote,
        timestamp: Date.now(),
      };

      await sidePanelClient.notifyMainStage(JSON.stringify(message));

      setHasVoted(true);
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Error enviant el vot. Torna-ho a provar.');
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    /**
     * Initializes the Add-on Side Panel Client and gets starting state
     */
    async function initializeSidePanelClient() {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });
      const client = await session.createSidePanelClient();
      setSidePanelClient(client);

      // Get the starting poll state
      const startingState = await client.getActivityStartingState();
      if (startingState.additionalData) {
        try {
          const state = JSON.parse(startingState.additionalData) as PollState;
          setPollState(state);
        } catch (error) {
          console.error('Error parsing poll state:', error);
        }
      }
    }
    initializeSidePanelClient();
  }, []);

  // Listen for messages from other side panels (via broadcast)
  useEffect(() => {
    if (!sidePanelClient) return;

    sidePanelClient.on('frameToFrameMessage', (message) => {
      try {
        const pollMessage = JSON.parse(message.payload) as PollMessage;

        switch (pollMessage.type) {
          case 'PARTICIPANT_JOINED':
            // Another participant registered, add them to the list
            const newParticipant = pollMessage.payload as Participant;
            setPollState((prev) => {
              if (!prev) return prev;
              // Avoid duplicates
              if (prev.participants.some((p) => p.id === newParticipant.id)) {
                return prev;
              }
              return {
                ...prev,
                participants: [...prev.participants, newParticipant],
              };
            });
            break;

          case 'VOTE_CAST':
            // Track votes for progress indication (optional)
            const newVote = pollMessage.payload as Vote;
            setPollState((prev) => {
              if (!prev) return prev;
              // Remove previous vote from same voter, add new one
              const filteredVotes = prev.votes.filter((v) => v.voterId !== newVote.voterId);
              return {
                ...prev,
                votes: [...filteredVotes, newVote],
              };
            });
            break;

          case 'STATE_UPDATE':
            setPollState(pollMessage.payload as PollState);
            break;
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
  }, [sidePanelClient]);

  if (!pollState) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregant...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6 bg-white dark:bg-gray-900">
      <div className="max-w-md mx-auto w-full">
        <PollQuestion round={pollState.round} />

        {!isRegistered ? (
          /* Registration form */
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Identifica&apos;t
            </h2>
            <form onSubmit={handleRegistration}>
              <label
                htmlFor="participant-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                El teu nom:
              </label>
              <input
                type="text"
                id="participant-name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Introdueix el teu nom"
                maxLength={50}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                aria-label="Introdueix el teu nom"
              />
              <button
                type="submit"
                disabled={!sidePanelClient || !participantName.trim()}
                className={`
                  w-full py-3 px-6 rounded-lg font-semibold text-white
                  transition-all duration-200
                  ${
                    !sidePanelClient || !participantName.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                `}
              >
                Continuar
              </button>
            </form>
          </div>
        ) : hasVoted ? (
          /* Vote confirmation */
          <VoteConfirmation votedForName={votedForName} />
        ) : (
          /* Voting interface */
          <div>
            <div className="mb-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Benvingut/da, <span className="font-semibold">{participantName}</span>!
              </p>
            </div>

            <div className="mb-6">
              <ParticipantList
                participants={pollState.participants}
                selectedParticipantId={selectedParticipantId}
                onSelect={setSelectedParticipantId}
                disabled={isSubmitting}
                loading={pollState.participants.length === 0}
              />
            </div>

            <VoteButton
              onClick={handleVoteSubmit}
              disabled={!selectedParticipantId || isSubmitting}
              loading={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
}
