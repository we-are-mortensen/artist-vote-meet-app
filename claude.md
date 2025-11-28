# Artist Vote - Google Meet Add-on

## Project Overview

This is a Next.js project that creates a Google Meet Add-on for voting on who is today's artist. The add-on displays a poll to all users in a Google Meet call, where the poll options are the names of all participants in the call. The results are displayed on the "mainstage" (the large screen view of the add-on).

**Important Context:**
- All code and comments are in English
- All user-facing content must be in Catalan
- The poll question is about who is today's artist ("Qui és l'artista d'avui?" in Catalan)
- Future enhancement planned: implement a second poll in case of a tie, showing only the tied options

## Technology Stack

- **Framework**: Next.js 16.0.5 (App Router)
- **Runtime**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, PostCSS
- **Google Meet SDK**: @googleworkspace/meet-addons ^1.2.0
- **Build Tool**: Next.js with Turbopack

## Project Structure

```
/src
  /app                          # Next.js App Router pages
    /activitysidepanel         # Side panel shown to participants during activity
      page.tsx                 # Color picker for individual participants
    /mainstage                 # Main stage view (large screen)
      page.tsx                 # Animated colors display
    /sidepanel                 # Initial side panel for activity setup
      page.tsx                 # Setup page for activity initiator
    page.tsx                   # Screenshare landing page
    layout.tsx                 # Root layout
    icon.svg                   # App icon (green striped design)
    globals.css                # Global styles with Tailwind
  /components
    prettyColors.tsx           # Animation component for mainstage
    prettyColors.css           # Styles for animation
  /shared
    constants.ts               # Configuration constants
```

## Key Configuration

### Constants ([src/shared/constants.ts](src/shared/constants.ts))

```typescript
// Google Cloud Project identifier
export const CLOUD_PROJECT_NUMBER = '315905898182';

// Base URL (switches based on debug mode)
export const SITE_BASE = inDebugMode()
  ? 'https://localhost:3000'
  : 'https://we-are-mortensen.github.io/meet-artist-vote-app';

// URL endpoints
export const MAIN_STAGE_URL = SITE_BASE + '/mainstage';
export const SIDE_PANEL_URL = SITE_BASE + '/sidepanel';
export const ACTIVITY_SIDE_PANEL_URL = SITE_BASE + '/activitysidepanel';
```

Debug mode is controlled by environment variable: `process.env.NEXT_PUBLIC_DEBUG === '1'`

## Google Meet Add-on Architecture

### Three Main Components

1. **Screenshare Landing Page** ([src/app/page.tsx](src/app/page.tsx))
   - Entry point for installing/opening the add-on
   - Uses `meet.addon.screensharing.exposeToMeetWhenScreensharing()`
   - Opens side panel for activity setup
   - `startActivityOnOpen: false` - requires manual start

2. **Side Panel** ([src/app/sidepanel/page.tsx](src/app/sidepanel/page.tsx))
   - Shown to the activity initiator for setup
   - Currently: allows picking a starting color
   - Creates `MeetSidePanelClient`
   - Calls `startActivity()` with:
     - `mainStageUrl`: URL for main stage
     - `sidePanelUrl`: URL for activity side panel
     - `additionalData`: JSON string with starting state
   - After starting, redirects to activity side panel

3. **Activity Side Panel** ([src/app/activitysidepanel/page.tsx](src/app/activitysidepanel/page.tsx))
   - Shown to all participants during the activity
   - Currently: individual color picker
   - Uses `notifyMainStage()` for frame-to-frame messaging
   - Sends updates to main stage

4. **Main Stage** ([src/app/mainstage/page.tsx](src/app/mainstage/page.tsx))
   - Large screen view shown to all participants
   - Creates `MeetMainStageClient`
   - Gets starting state via `getActivityStartingState()`
   - Listens for frame-to-frame messages via `on('frameToFrameMessage')`
   - Currently: displays animated colors based on messages

### Current Implementation (Pretty Colors Demo)

The existing code is a demo that:
- Lets the initiator pick a starting color
- Displays animated spinning lines on main stage
- Allows each participant to change colors (only they see their changes)
- Uses the `PrettyColors` component for visual display

This demo structure needs to be adapted for the artist voting functionality.

## Development Setup

### Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
# Runs on https://localhost:3000 when NEXT_PUBLIC_DEBUG=1
```

### Building for Production
```bash
npm run build
npm start
```

### Environment Variables
- `NEXT_PUBLIC_DEBUG=1` - Enables localhost mode, otherwise uses GitHub Pages URL

## Implementation Plan for Artist Vote Feature

### What Needs to Change

1. **Side Panel Setup** ([src/app/sidepanel/page.tsx](src/app/sidepanel/page.tsx))
   - Remove color picker
   - Fetch list of meeting participants
   - Display hardcoded question in Catalan
   - Show "Start voting" button
   - Pass participant list in `additionalData`

2. **Activity Side Panel** ([src/app/activitysidepanel/page.tsx](src/app/activitysidepanel/page.tsx))
   - Display poll question in Catalan: "Qui és l'artista d'avui?"
   - Show list of participants as radio buttons/options
   - Submit button to cast vote
   - Send vote to main stage via `notifyMainStage()`
   - Show confirmation after voting

3. **Main Stage** ([src/app/mainstage/page.tsx](src/app/mainstage/page.tsx))
   - Replace `PrettyColors` component
   - Display poll results in real-time
   - Show vote counts for each participant
   - Update as votes come in via frame-to-frame messages
   - Visual display of results (bars, percentages, etc.)
   - All text in Catalan

4. **Components**
   - Remove or replace `prettyColors.tsx` and `prettyColors.css`
   - Create new components:
     - `PollQuestion.tsx` - Display question
     - `ParticipantList.tsx` - List participants as options
     - `VoteResults.tsx` - Display results on main stage
     - `VoteConfirmation.tsx` - Show after voting

5. **Data Flow**
   ```
   Setup Side Panel
     ↓ (get participants, pass in additionalData)
   Main Stage (receives starting state)
     ↓
   Activity Side Panel (each participant votes)
     ↓ (notifyMainStage with vote)
   Main Stage (aggregates votes, updates display)
   ```

### Google Meet Add-ons SDK Key Methods

- `meet.addon.createAddonSession({ cloudProjectNumber })` - Initialize session
- `session.createMainStageClient()` - Get main stage client
- `session.createSidePanelClient()` - Get side panel client
- `mainStageClient.getActivityStartingState()` - Get initial data
- `mainStageClient.on('frameToFrameMessage', callback)` - Listen for messages
- `sidePanelClient.startActivity({ mainStageUrl, sidePanelUrl, additionalData })` - Start activity
- `sidePanelClient.notifyMainStage(payload)` - Send message to main stage

### API for Getting Meeting Participants

**Note**: The Google Meet Add-ons SDK provides access to participant information. Check the documentation at:
https://developers.google.com/workspace/meet/add-ons/reference/websdk/addon_sdk

Methods to explore:
- `MeetAddonSession.getMeetingInfo()` - May provide participant list
- Co-activity APIs for participant discovery

### Future Enhancement: Tiebreaker Poll

If there's a tie in the votes:
1. Detect tied options after voting closes
2. Create a second poll with only the tied options
3. Run the tiebreaker poll with same flow
4. Display final winner

## Styling Notes

- Uses Tailwind CSS 4 with PostCSS
- Global styles in [src/app/globals.css](src/app/globals.css)
- Dark mode support via `prefers-color-scheme`
- CSS variables: `--background`, `--foreground`
- Font: Arial, Helvetica, sans-serif

## Git Information

- Current branch: `master`
- Main branch: `master`
- Repository is hosted on GitHub: `we-are-mortensen/meet-artist-vote-app`
- GitHub Pages URL: https://we-are-mortensen.github.io/meet-artist-vote-app

## Important Links

- [Google Meet Add-ons Quickstart](https://developers.google.com/workspace/meet/add-ons/guides/quickstart)
- [Google Meet Add-ons Overview](https://developers.google.com/meet/add-ons/guides/overview)
- [Main Stage Guide](https://developers.google.com/meet/add-ons/guides/overview#main-stage)
- [Side Panel Guide](https://developers.google.com/meet/add-ons/guides/overview#side-panel)
- [Screensharing Guide](https://developers.google.com/meet/add-ons/guides/screen-sharing)
- [SDK Reference](https://developers.google.com/meet/add-ons/reference/websdk/addon_sdk)

## TypeScript Configuration

- Target: ES2017
- JSX: react-jsx (React 19 automatic JSX transform)
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Module resolution: bundler

## Next Steps for Implementation

1. Research participant API in Google Meet Add-ons SDK
2. Design UI/UX for voting interface (in Catalan)
3. Implement participant fetching in setup side panel
4. Build voting UI in activity side panel
5. Create results display for main stage
6. Implement real-time vote aggregation
7. Add vote confirmation and completion states
8. Test in actual Google Meet environment
9. Plan tiebreaker poll feature architecture
