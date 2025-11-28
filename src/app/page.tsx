'use client';

import { useEffect } from 'react';
import { meet } from '@googleworkspace/meet-addons/meet.addons.screenshare';
import { CLOUD_PROJECT_NUMBER, SIDE_PANEL_URL } from '../shared/constants';

export default function App() {
  /**
   * Screensharing this page will prompt you to install/open this add-on.
   * When it is opened, it will prompt you to set up the add-on in the side
   * panel before starting the activity for everyone.
   * @see {@link https://developers.google.com/meet/add-ons/guides/screen-sharing}
   */
  useEffect(() => {
    meet.addon.screensharing.exposeToMeetWhenScreensharing({
      cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      // Will open the Side Panel for the activity initiator to set the
      // activity starting state. Activity won't start for other participants.
      sidePanelUrl: SIDE_PANEL_URL,
      startActivityOnOpen: false,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-linear-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Votació de l&apos;Artista
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Comparteix aquesta pàgina per activar el complement de Google Meet i començar la votació.
        </p>
        <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg p-6 mb-8">
          <p className="text-base text-blue-900 dark:text-blue-100 font-medium">
            📺 Per començar:
          </p>
          <ol className="text-left text-blue-800 dark:text-blue-200 mt-4 space-y-2">
            <li>1. Comparteix aquesta pantalla a Google Meet</li>
            <li>2. Obre el complement quan aparegui</li>
            <li>3. Comença la votació des del panell lateral</li>
          </ol>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Qui serà l&apos;artista d&apos;avui?
        </p>
      </div>
    </div>
  );
}
