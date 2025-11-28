'use client';

import { useEffect, useState } from 'react';
import {
  meet,
  FrameToFrameMessage,
  MeetMainStageClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { CLOUD_PROJECT_NUMBER } from '../../shared/constants';
import type {
  Participant,
  Vote,
  PollState,
  PollMessage,
  VoteResults as VoteResultsType,
} from '../../types/poll.types';
import { calculateResults } from '../../utils/voteCalculations';
import VoteResults from '../../components/VoteResults';

/**
 * Main stage view - displays voting results in real-time
 * @see {@link https://developers.google.com/meet/add-ons/guides/overview#main-stage}
 */
export default function Page() {
  const [pollState, setPollState] = useState<PollState | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [results, setResults] = useState<VoteResultsType | null>(null);

  /**
   * Creates a MeetMainStageClient to control the main stage of the add-on.
   * https://developers.google.com/meet/add-ons/reference/websdk/addon_sdk.meetmainstageclient
   */
  async function initializeMainStageClient(): Promise<MeetMainStageClient> {
    const session = await meet.addon.createAddonSession({
      cloudProjectNumber: CLOUD_PROJECT_NUMBER,
    });
    return await session.createMainStageClient();
  }

  /**
   * Parses the initial poll state from the starting state
   */
  async function setStartingState(mainStageClient: MeetMainStageClient) {
    const startingState = await mainStageClient.getActivityStartingState();
    if (startingState.additionalData) {
      try {
        const state = JSON.parse(startingState.additionalData) as PollState;
        setPollState(state);
        setParticipants(state.participants);
        setVotes(state.votes);
      } catch (error) {
        console.error('Error parsing starting state:', error);
      }
    }
  }

  /**
   * Listens for frame-to-frame messages from side panels
   * Handles participant registration and vote submissions
   */
  function listenForMessages(mainStageClient: MeetMainStageClient) {
    mainStageClient.on(
      'frameToFrameMessage',
      (message: FrameToFrameMessage) => {
        try {
          const pollMessage = JSON.parse(message.payload) as PollMessage;

          switch (pollMessage.type) {
            case 'PARTICIPANT_JOINED':
              const newParticipant = pollMessage.payload as Participant;
              setParticipants((prev) => {
                // Avoid duplicates
                if (prev.some((p) => p.id === newParticipant.id)) {
                  return prev;
                }
                return [...prev, newParticipant];
              });
              break;

            case 'VOTE_CAST':
              const newVote = pollMessage.payload as Vote;
              setVotes((prev) => {
                // Replace vote if same voter (allow vote changes)
                const filtered = prev.filter((v) => v.voterId !== newVote.voterId);
                return [...filtered, newVote];
              });
              break;

            case 'STATE_UPDATE':
              const updatedState = pollMessage.payload as PollState;
              setPollState(updatedState);
              setParticipants(updatedState.participants);
              setVotes(updatedState.votes);
              break;
          }
        } catch (error) {
          console.error('Error handling frame-to-frame message:', error);
        }
      }
    );
  }

  // Recalculate results whenever votes or participants change
  useEffect(() => {
    if (participants.length > 0) {
      const calculatedResults = calculateResults(votes, participants);
      setResults(calculatedResults);
    }
  }, [votes, participants]);

  useEffect(() => {
    /**
     * Initialize the main stage by initializing the client, then using that
     * client to get the starting state and listen for messages
     */
    async function initializeMainStage() {
      const client = await initializeMainStageClient();
      await setStartingState(client);
      listenForMessages(client);
    }
    initializeMainStage();
  }, []);

  if (!pollState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600 mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Inicialitzant votació...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {results ? (
        <VoteResults results={results} votingInProgress={pollState.status === 'voting'} />
      ) : (
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Qui és l&apos;artista d&apos;avui?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Esperant que els participants es registrin...
            </p>
          </div>
          <div className="inline-block animate-pulse">
            <svg
              className="h-24 w-24 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
