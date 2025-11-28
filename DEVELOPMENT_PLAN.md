# Development Plan: Artist Vote Add-on for Google Meet

This document provides a comprehensive, step-by-step plan to transform the current "Pretty Colors" demo into a functional Artist Vote add-on for Google Meet.

---

## Phase 1: Research & Setup

### Step 1.1: Research Google Meet Participants API
- [ ] Read Google Meet Add-ons SDK documentation for participant methods
- [ ] Investigate `MeetAddonSession.getMeetingInfo()` or similar methods
- [ ] Check if there's a `getParticipants()` or equivalent API
- [ ] Determine how to get participant names/IDs
- [ ] Test participant API in development environment
- [ ] Document findings and API limitations

**Files to reference:**
- [@googleworkspace/meet-addons SDK documentation](https://developers.google.com/meet/add-ons/reference/websdk/addon_sdk)

**Expected outcome:** Clear understanding of how to retrieve and work with participant data

---

### Step 1.2: Set Up Development Environment
- [ ] Ensure `NEXT_PUBLIC_DEBUG=1` is set for local development
- [ ] Test current demo on `https://localhost:3000`
- [ ] Verify SSL certificate for local HTTPS
- [ ] Test screenshare functionality in Google Meet
- [ ] Confirm all three views load correctly (screenshare, sidepanel, mainstage)

**Commands:**
```bash
npm install
npm run dev
```

**Expected outcome:** Working local development environment with demo functioning

---

### Step 1.3: Design UI/UX in Catalan
- [ ] Write all Catalan text content needed:
  - Poll question: "Qui és l'artista d'avui?"
  - Button labels: "Començar votació", "Enviar vot", etc.
  - Status messages: "Vot enviat", "Esperant vots...", etc.
- [ ] Sketch/wireframe the voting interface
- [ ] Design results display layout for mainstage
- [ ] Plan color scheme and visual hierarchy
- [ ] Ensure mobile-friendly design (side panel on mobile devices)

**Expected outcome:** Complete UI specifications and Catalan content

---

## Phase 2: Data Structure & Type Definitions

### Step 2.1: Define TypeScript Types
- [ ] Create `src/types/poll.types.ts` file
- [ ] Define `Participant` type:
  ```typescript
  type Participant = {
    id: string;
    name: string;
  }
  ```
- [ ] Define `Vote` type:
  ```typescript
  type Vote = {
    voterId: string;
    selectedParticipantId: string;
    timestamp: number;
  }
  ```
- [ ] Define `PollState` type:
  ```typescript
  type PollState = {
    participants: Participant[];
    votes: Vote[];
    status: 'setup' | 'voting' | 'completed';
  }
  ```
- [ ] Define `VoteResults` type:
  ```typescript
  type VoteResults = {
    participantId: string;
    participantName: string;
    voteCount: number;
    percentage: number;
  }
  ```
- [ ] Define message types for frame-to-frame communication

**File to create:** `src/types/poll.types.ts`

**Expected outcome:** Type-safe data structures for the entire voting system

---

### Step 2.2: Create Utility Functions
- [ ] Create `src/utils/voteCalculations.ts` file
- [ ] Implement `calculateResults(votes: Vote[], participants: Participant[]): VoteResults[]`
- [ ] Implement `detectTie(results: VoteResults[]): Participant[] | null`
- [ ] Implement `sortByVoteCount(results: VoteResults[]): VoteResults[]`
- [ ] Add unit tests for utility functions (optional but recommended)

**File to create:** `src/utils/voteCalculations.ts`

**Expected outcome:** Reusable functions for vote counting and result calculation

---

## Phase 3: Components Development

### Step 3.1: Create Poll Question Component
- [ ] Create `src/components/PollQuestion.tsx`
- [ ] Display hardcoded question in Catalan: "Qui és l'artista d'avui?"
- [ ] Style with Tailwind CSS
- [ ] Make it responsive
- [ ] Add optional subtitle/description prop

**File to create:** `src/components/PollQuestion.tsx`

**Expected outcome:** Reusable component for displaying the poll question

---

### Step 3.2: Create Participant List Component
- [ ] Create `src/components/ParticipantList.tsx`
- [ ] Accept `participants: Participant[]` prop
- [ ] Render as radio button group
- [ ] Style with Tailwind CSS
- [ ] Add hover effects and accessibility attributes
- [ ] Handle selection state
- [ ] Add loading state for when participants are being fetched

**File to create:** `src/components/ParticipantList.tsx`

**Expected outcome:** Interactive list for participant selection

---

### Step 3.3: Create Vote Button Component
- [ ] Create `src/components/VoteButton.tsx`
- [ ] Accept `onClick` handler and `disabled` state
- [ ] Display "Enviar vot" in Catalan
- [ ] Show loading spinner when submitting
- [ ] Add disabled state styling
- [ ] Include success/error states

**File to create:** `src/components/VoteButton.tsx`

**Expected outcome:** Reusable button for vote submission

---

### Step 3.4: Create Vote Confirmation Component
- [ ] Create `src/components/VoteConfirmation.tsx`
- [ ] Show success message: "Vot enviat correctament!"
- [ ] Display which participant was voted for
- [ ] Show waiting message: "Esperant la resta de vots..."
- [ ] Style with success colors (green theme)

**File to create:** `src/components/VoteConfirmation.tsx`

**Expected outcome:** User feedback after voting

---

### Step 3.5: Create Vote Results Component
- [ ] Create `src/components/VoteResults.tsx`
- [ ] Accept `results: VoteResults[]` prop
- [ ] Display each participant with their vote count
- [ ] Show percentage bars (visual representation)
- [ ] Highlight winner (if voting completed)
- [ ] Show live updates as votes come in
- [ ] Handle tie scenario display
- [ ] Make it responsive for main stage display

**File to create:** `src/components/VoteResults.tsx`

**Expected outcome:** Visual display of voting results for main stage

---

### Step 3.6: Create Loading Component
- [ ] Create `src/components/LoadingSpinner.tsx`
- [ ] Add spinner animation
- [ ] Optional loading text in Catalan
- [ ] Use for async operations

**File to create:** `src/components/LoadingSpinner.tsx`

**Expected outcome:** Consistent loading indicator across app

---

## Phase 4: Page Implementation

### Step 4.1: Update Screenshare Landing Page
- [ ] Open `src/app/page.tsx`
- [ ] Update text content to Catalan
- [ ] Change "Screenshare this page to promote an add-on" to appropriate Catalan text
- [ ] Keep existing screenshare logic intact
- [ ] Add branding/instructions for Artist Vote add-on

**File to edit:** [src/app/page.tsx](src/app/page.tsx)

**Expected outcome:** Catalan landing page that promotes the add-on

---

### Step 4.2: Implement Setup Side Panel
- [ ] Open `src/app/sidepanel/page.tsx`
- [ ] Remove color picker code
- [ ] Add state for participants: `const [participants, setParticipants] = useState<Participant[]>([])`
- [ ] Add loading state: `const [loading, setLoading] = useState(true)`
- [ ] Implement `fetchParticipants()` function using Meet SDK
- [ ] Call `fetchParticipants()` in useEffect
- [ ] Display participant list (read-only, just for preview)
- [ ] Update button text to "Començar votació" in Catalan
- [ ] Update `startCollaboration()` function:
  - Remove color logic
  - Pass participants list in `additionalData`
  - Keep same structure for starting activity
- [ ] Add error handling for participant fetching
- [ ] Display welcome message in Catalan

**File to edit:** [src/app/sidepanel/page.tsx](src/app/sidepanel/page.tsx)

**Expected outcome:** Setup page that fetches participants and starts voting activity

---

### Step 4.3: Implement Activity Side Panel (Voting Interface)
- [ ] Open `src/app/activitysidepanel/page.tsx`
- [ ] Remove color picker code
- [ ] Add state for participants, selected participant, vote status
  ```typescript
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  ```
- [ ] Import necessary components (PollQuestion, ParticipantList, VoteButton, VoteConfirmation)
- [ ] Get participants from session/starting state
- [ ] Implement `handleVoteSubmit()` function:
  - Validate selection
  - Set submitting state
  - Create vote object with timestamp
  - Call `sidePanelClient.notifyMainStage()` with vote data
  - Set hasVoted to true
  - Handle errors
- [ ] Render PollQuestion component
- [ ] Render ParticipantList if not voted
- [ ] Render VoteButton if not voted
- [ ] Render VoteConfirmation if voted
- [ ] Add error handling and user feedback

**File to edit:** [src/app/activitysidepanel/page.tsx](src/app/activitysidepanel/page.tsx)

**Expected outcome:** Functional voting interface for all participants

---

### Step 4.4: Implement Main Stage (Results Display)
- [ ] Open `src/app/mainstage/page.tsx`
- [ ] Remove PrettyColors import and usage
- [ ] Add state for poll data:
  ```typescript
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [results, setResults] = useState<VoteResults[]>([]);
  ```
- [ ] Update `setStartingState()` to parse participants from additionalData
- [ ] Update `awaitNewColor()` to `awaitNewVote()`:
  - Listen for vote messages
  - Add vote to votes array
  - Recalculate results
  - Update state
- [ ] Import VoteResults component
- [ ] Render VoteResults with calculated results
- [ ] Add useEffect to recalculate results when votes change
- [ ] Display "Esperant vots..." when no votes yet
- [ ] Show live vote count updates
- [ ] Highlight winner when all votes are in (optional: add timer or manual completion)

**File to edit:** [src/app/mainstage/page.tsx](src/app/mainstage/page.tsx)

**Expected outcome:** Real-time results display on main stage

---

## Phase 5: Styling & Polish

### Step 5.1: Update Global Styles
- [ ] Open `src/app/globals.css`
- [ ] Add custom CSS variables for vote colors:
  ```css
  --vote-primary: #your-color;
  --vote-secondary: #your-color;
  --vote-success: #your-color;
  ```
- [ ] Ensure mobile responsiveness
- [ ] Test dark mode support

**File to edit:** [src/app/globals.css](src/app/globals.css)

**Expected outcome:** Consistent styling across all views

---

### Step 5.2: Component Styling
- [ ] Style PollQuestion with appropriate typography
- [ ] Style ParticipantList with clear selection states
- [ ] Style VoteButton with hover/active/disabled states
- [ ] Style VoteConfirmation with success indicators
- [ ] Style VoteResults with:
  - Clear typography hierarchy
  - Animated percentage bars
  - Winner highlighting
  - Smooth transitions for vote updates

**Expected outcome:** Professional, polished UI

---

### Step 5.3: Add Icon/Branding
- [ ] Update `src/app/icon.svg` if needed
- [ ] Update `src/app/layout.tsx` metadata:
  - Title: "Artist Vote" or appropriate Catalan title
  - Description in Catalan
- [ ] Add favicon if needed

**Files to edit:**
- [src/app/icon.svg](src/app/icon.svg)
- [src/app/layout.tsx](src/app/layout.tsx)

**Expected outcome:** Proper branding and metadata

---

## Phase 6: Testing & Debugging

### Step 6.1: Local Testing
- [ ] Test in browser at `https://localhost:3000`
- [ ] Test screenshare landing page
- [ ] Test setup side panel
- [ ] Test activity side panel voting
- [ ] Test main stage results display
- [ ] Test with multiple browser tabs simulating different participants
- [ ] Verify all text is in Catalan
- [ ] Test error scenarios (no participants, network errors, etc.)

**Expected outcome:** All functionality works in local environment

---

### Step 6.2: Google Meet Integration Testing
- [ ] Create a test Google Meet call
- [ ] Screenshare the landing page
- [ ] Install/open the add-on in Meet
- [ ] Test setup flow
- [ ] Start activity and verify main stage appears
- [ ] Test voting from multiple participants (need multiple accounts/devices)
- [ ] Verify real-time updates work in Meet
- [ ] Test on different devices (desktop, mobile, tablet)
- [ ] Test with different numbers of participants (2, 5, 10+)

**Expected outcome:** Fully functional add-on in Google Meet environment

---

### Step 6.3: Edge Case Testing
- [ ] Test with 1 participant (should handle gracefully)
- [ ] Test with very long participant names
- [ ] Test rapid voting (all participants vote quickly)
- [ ] Test slow voting (some participants don't vote)
- [ ] Test network interruptions
- [ ] Test reopening side panel after voting
- [ ] Test refreshing main stage during voting
- [ ] Test closing and reopening the add-on

**Expected outcome:** Robust error handling and edge case coverage

---

## Phase 7: Deployment Preparation

### Step 7.1: Update Constants for Production
- [ ] Open `src/shared/constants.ts`
- [ ] Verify `CLOUD_PROJECT_NUMBER` is correct
- [ ] Verify production URL: `https://we-are-mortensen.github.io/meet-artist-vote-app`
- [ ] Ensure `NEXT_PUBLIC_DEBUG` environment variable is NOT set for production build

**File to edit:** [src/shared/constants.ts](src/shared/constants.ts)

**Expected outcome:** Correct production configuration

---

### Step 7.2: Build for Production
- [ ] Run `npm run build`
- [ ] Fix any build errors or warnings
- [ ] Verify build output in `.next` directory
- [ ] Test production build locally: `npm start`
- [ ] Verify all pages work in production mode

**Commands:**
```bash
npm run build
npm start
```

**Expected outcome:** Clean production build

---

### Step 7.3: Configure Next.js for GitHub Pages
- [ ] Update `next.config.ts`:
  ```typescript
  const nextConfig: NextConfig = {
    output: 'export', // for static export
    basePath: '/meet-artist-vote-app',
    images: {
      unoptimized: true, // required for static export
    },
  };
  ```
- [ ] Add `.nojekyll` file to public directory
- [ ] Create/update GitHub Actions workflow for deployment (if not exists)

**File to edit:** [next.config.ts](next.config.ts)

**Expected outcome:** Next.js configured for static export to GitHub Pages

---

### Step 7.4: Deploy to GitHub Pages
- [ ] Build static export: `npm run build`
- [ ] Deploy `out` directory to GitHub Pages
- [ ] Verify deployment at production URL
- [ ] Test all functionality on production URL
- [ ] Verify HTTPS works correctly

**Expected outcome:** Live production deployment

---

## Phase 8: Documentation

### Step 8.1: Update README
- [ ] Open `README.md`
- [ ] Add project description in English
- [ ] Add setup instructions
- [ ] Add deployment instructions
- [ ] Add usage instructions for Google Meet
- [ ] Add screenshots/demo GIF
- [ ] Add troubleshooting section

**File to edit:** [README.md](README.md)

**Expected outcome:** Complete project documentation

---

### Step 8.2: Add Code Comments
- [ ] Review all modified files
- [ ] Add JSDoc comments to functions
- [ ] Add inline comments for complex logic
- [ ] Ensure all Catalan text has comments explaining what it says in English

**Expected outcome:** Well-documented codebase

---

### Step 8.3: Create User Guide (Optional)
- [ ] Create `USER_GUIDE.md` in Catalan
- [ ] Explain how to use the add-on
- [ ] Add screenshots of each step
- [ ] Include FAQ section

**File to create:** `USER_GUIDE.md`

**Expected outcome:** User-friendly guide for end users

---

## Phase 9: Future Enhancements (Tiebreaker)

### Step 9.1: Design Tiebreaker Flow
- [ ] Plan UI for tie detection
- [ ] Design tiebreaker poll interface
- [ ] Plan state management for multi-round voting
- [ ] Sketch tiebreaker results display

**Expected outcome:** Clear plan for tiebreaker feature

---

### Step 9.2: Implement Tie Detection
- [ ] Update `src/utils/voteCalculations.ts`
- [ ] Implement `detectTie()` function
- [ ] Add logic to identify tied participants
- [ ] Test tie detection with various vote scenarios

**Expected outcome:** Reliable tie detection

---

### Step 9.3: Implement Tiebreaker Poll
- [ ] Add tiebreaker state to main stage
- [ ] Create tiebreaker poll with only tied participants
- [ ] Update activity side panel to show tiebreaker
- [ ] Update main stage to show tiebreaker results
- [ ] Add "round 2" indicator in UI
- [ ] Test complete flow with tie scenarios

**Expected outcome:** Functional tiebreaker voting round

---

## Phase 10: Optimization & Polish

### Step 10.1: Performance Optimization
- [ ] Optimize component re-renders (use React.memo if needed)
- [ ] Minimize bundle size (check `npm run build` output)
- [ ] Optimize images/assets
- [ ] Test loading performance

**Expected outcome:** Fast, efficient application

---

### Step 10.2: Accessibility
- [ ] Add ARIA labels to all interactive elements
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Ensure color contrast meets WCAG standards
- [ ] Add focus indicators

**Expected outcome:** Accessible interface for all users

---

### Step 10.3: Final Testing & Launch
- [ ] Complete end-to-end testing in Google Meet
- [ ] Test with real users
- [ ] Gather feedback
- [ ] Fix any bugs
- [ ] Deploy final version
- [ ] Announce/share with intended users

**Expected outcome:** Production-ready, tested application

---

## Summary Checklist

### Core Functionality
- [ ] Participant fetching works
- [ ] Setup side panel displays participants
- [ ] Activity side panel allows voting
- [ ] Main stage displays real-time results
- [ ] All text is in Catalan
- [ ] Votes are counted correctly
- [ ] Results update in real-time

### Code Quality
- [ ] TypeScript types defined
- [ ] Components are reusable
- [ ] Code is well-documented
- [ ] No console errors
- [ ] No TypeScript errors

### User Experience
- [ ] UI is intuitive
- [ ] Responsive on all devices
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Vote confirmation is clear

### Deployment
- [ ] Production build works
- [ ] Deployed to GitHub Pages
- [ ] Works in Google Meet
- [ ] SSL/HTTPS configured
- [ ] Documentation complete

---

## Estimated Time per Phase

- **Phase 1 (Research & Setup)**: 4-6 hours
- **Phase 2 (Data Structure)**: 2-3 hours
- **Phase 3 (Components)**: 6-8 hours
- **Phase 4 (Pages)**: 8-10 hours
- **Phase 5 (Styling)**: 4-6 hours
- **Phase 6 (Testing)**: 6-8 hours
- **Phase 7 (Deployment)**: 2-3 hours
- **Phase 8 (Documentation)**: 2-4 hours
- **Phase 9 (Tiebreaker)**: 6-8 hours (future)
- **Phase 10 (Polish)**: 4-6 hours

**Total Estimated Time (without tiebreaker)**: 38-54 hours
**Total Estimated Time (with tiebreaker)**: 44-62 hours

---

## Notes

- This plan assumes familiarity with React, TypeScript, and Next.js
- Actual time may vary based on API availability and complexity
- Some steps may be done in parallel
- Testing should be continuous throughout development
- Adjust plan based on Google Meet SDK capabilities discovered in Phase 1

---

**Version**: 1.0
**Last Updated**: 2025-11-28
**Status**: Ready for implementation
