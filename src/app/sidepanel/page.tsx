'use client';

import { useEffect, useState } from 'react';
import {
  meet,
  MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';
import {
  ACTIVITY_SIDE_PANEL_URL,
  CLOUD_PROJECT_NUMBER,
  MAIN_STAGE_URL,
} from '../../shared/constants';
import { generatePollId } from '../../utils/voteCalculations';
import type { PollState } from '../../types/poll.types';

/**
 * Setup side panel for the activity initiator
 * This is where the poll is configured and started
 * @see {@link https://developers.google.com/meet/add-ons/guides/overview#side-panel}
 */
export default function Page() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();
  const [isStarting, setIsStarting] = useState(false);

  /**
   * Starts the voting activity
   * Initializes the poll state and launches the activity for all participants
   */
  async function startVoting() {
    if (!sidePanelClient) {
      throw new Error('Side Panel is not yet initialized!');
    }

    setIsStarting(true);

    try {
      // Initialize poll state
      const pollState: PollState = {
        participants: [], // Participants will register themselves
        votes: [],
        status: 'voting',
        question: "Qui és l'artista d'avui?",
        pollId: generatePollId(),
        round: 1,
      };

      await sidePanelClient.startActivity({
        mainStageUrl: MAIN_STAGE_URL,
        sidePanelUrl: ACTIVITY_SIDE_PANEL_URL,
        // Pass the initial poll state
        additionalData: JSON.stringify(pollState),
      });

      window.location.replace(ACTIVITY_SIDE_PANEL_URL + window.location.search);
    } catch (error) {
      console.error('Error starting voting activity:', error);
      setIsStarting(false);
      alert('Error iniciant la votació. Torna-ho a provar.');
    }
  }

  useEffect(() => {
    /**
     * Initializes the Add-on Side Panel Client.
     * https://developers.google.com/meet/add-ons/reference/websdk/addon_sdk.meetsidepanelclient
     */
    async function initializeSidePanelClient() {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });
      const client = await session.createSidePanelClient();
      setSidePanelClient(client);
    }
    initializeSidePanelClient();
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-6 bg-white dark:bg-gray-900">
      <div className="max-w-md mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Votació de l&apos;Artista
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configura i inicia la votació
          </p>
        </div>

        {/* Info card */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Què passarà?
          </h2>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200 text-sm">
            <li>• Els participants s&apos;identificaran amb el seu nom</li>
            <li>• Cadascú votarà per qui creu que és l&apos;artista d&apos;avui</li>
            <li>• Els resultats es mostraran en temps real a la pantalla principal</li>
          </ul>
        </div>

        {/* Question preview */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pregunta:
          </h3>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Qui és l&apos;artista d&apos;avui?
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={startVoting}
          disabled={!sidePanelClient || isStarting}
          aria-label="Començar la votació"
          className={`
            w-full py-4 px-6 rounded-lg font-semibold text-white text-lg
            transition-all duration-200
            ${
              !sidePanelClient || isStarting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800 hover:shadow-lg'
            }
            flex items-center justify-center gap-2
          `}
        >
          {isStarting ? (
            <>
              <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              <span>Iniciant votació...</span>
            </>
          ) : (
            <>
              <span>🎨</span>
              <span>Començar votació</span>
            </>
          )}
        </button>

        {!sidePanelClient && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-4">
            Inicialitzant...
          </p>
        )}
      </div>
    </div>
  );
}
