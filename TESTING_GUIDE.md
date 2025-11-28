# Testing Guide: Artist Vote Add-on

This guide provides instructions for testing the Artist Vote add-on locally and in Google Meet.

---

## 🖥️ Local Testing

### Prerequisites
- Node.js installed
- Repository cloned
- Dependencies installed (`npm install`)

### Start Development Server

```bash
# Set environment variable for local development
export NEXT_PUBLIC_DEBUG=1

# Start the server
npm run dev
```

The server will start at: **http://localhost:3000**

### Test Each Page

#### 1. **Screenshare Landing Page**
- Navigate to: http://localhost:3000
- **Expected**: Beautiful Catalan landing page with instructions
- **Check**:
  - Title: "Votació de l'Artista"
  - Gradient background
  - Instructions in Catalan
  - Responsive design

#### 2. **Setup Side Panel**
- Navigate to: http://localhost:3000/sidepanel
- **Expected**: Setup interface for activity initiator
- **Check**:
  - "Començar votació" button
  - Info card explaining what will happen
  - Question preview
  - Button disabled until client initializes

**Note**: In local testing without Meet SDK, the button will remain disabled. This is expected behavior.

#### 3. **Activity Side Panel**
- Navigate to: http://localhost:3000/activitysidepanel
- **Expected**: Participant registration and voting interface
- **Check**:
  - Poll question displays
  - Registration form appears
  - All text in Catalan
  - Form validation works

**Note**: Without Meet SDK context, this will show a loading state. This is expected.

#### 4. **Main Stage**
- Navigate to: http://localhost:3000/mainstage
- **Expected**: Results display area
- **Check**:
  - Loading state appears
  - Layout is responsive
  - Dark mode works

**Note**: Without Meet SDK context, this will show a loading state. This is expected.

### Test Components Visually

You can modify the pages temporarily to test components in isolation:

```tsx
// Example: Test VoteResults component
import VoteResults from '@/components/VoteResults';

// Add mock data
const mockResults = {
  results: [
    { participantId: '1', participantName: 'Alice', voteCount: 5, percentage: 50, voters: ['Bob', 'Charlie', 'David', 'Eve', 'Frank'] },
    { participantId: '2', participantName: 'Bob', voteCount: 3, percentage: 30, voters: ['Alice', 'Grace', 'Henry'] },
    { participantId: '3', participantName: 'Charlie', voteCount: 2, percentage: 20, voters: ['Isaac', 'Jane'] },
  ],
  totalVotes: 10,
  hasTie: false,
  tiedParticipants: [],
  winner: { participantId: '1', participantName: 'Alice', voteCount: 5, percentage: 50, voters: [] },
};

return <VoteResults results={mockResults} votingInProgress={true} />;
```

---

## 🎥 Google Meet Testing

### Prerequisites

1. **Google Cloud Project**: Must have Cloud Project Number: `315905898182` configured
2. **Meet Add-on**: Must be registered in Google Workspace Marketplace
3. **HTTPS**: Must deploy to HTTPS URL (localhost won't work in Meet)
4. **Multiple Accounts**: Need at least 2-3 Google accounts for full testing

### Deployment Options

#### Option 1: GitHub Pages (Recommended)
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
# (Follow GitHub Pages deployment process)
```
Production URL: https://we-are-mortensen.github.io/meet-artist-vote-app

#### Option 2: Local HTTPS (for testing)
```bash
# Install mkcert for local HTTPS
brew install mkcert
mkcert -install

# Create certificates
mkcert localhost

# Start with HTTPS
# (Configure Next.js for HTTPS or use ngrok)
```

### Testing Flow

#### Step 1: Start a Google Meet Call
1. Create a new Google Meet call
2. Join with your primary account
3. Have at least one other participant join (or join with a second device/account)

#### Step 2: Share the Add-on
1. In the Meet call, start screen sharing
2. Select the browser tab with: https://your-deployment-url.com
3. **Expected**: Google Meet prompts to install/open the add-on
4. Click to open the add-on

#### Step 3: Setup (Initiator Only)
1. The setup side panel opens for you (the initiator)
2. **Expected**:
   - See "Votació de l'Artista" title
   - See explanation of what will happen
   - See "Començar votació" button
3. Click "Començar votació"
4. **Expected**:
   - Main stage appears for all participants
   - You're redirected to the activity side panel

#### Step 4: Register Participants
Each participant (including initiator):
1. Opens the add-on side panel
2. **Expected**: Registration form with "El teu nom:"
3. Enter your name
4. Click "Continuar"
5. **Expected**:
   - Success! Moves to voting interface
   - Main stage should update with new participant

**Test**: Check main stage - should show "Esperant vots..." until participants are registered

#### Step 5: Vote
Each participant:
1. **Expected**: See list of all registered participants
2. Select one participant (radio button)
3. Click "Enviar vot"
4. **Expected**:
   - Success message: "Vot enviat correctament!"
   - Shows who you voted for
   - "Esperant la resta de vots..." message

#### Step 6: View Results (Main Stage)
As votes come in:
1. **Expected**: Main stage updates in real-time
2. **Check**:
   - Vote counts update
   - Percentage bars animate
   - Progress bars show correctly
   - Vote totals are accurate

After all votes:
1. **Expected**:
   - Winner announced with crown emoji 👑
   - Winner has yellow highlight
   - Or tie message if multiple participants tied

---

## 🧪 Test Scenarios

### Scenario 1: Basic Flow (2 participants)
1. Alice and Bob join Meet
2. Alice starts add-on
3. Alice registers as "Alice"
4. Bob registers as "Bob"
5. Alice votes for Bob
6. Bob votes for Alice
**Expected**: Main stage shows 1 vote each (tie)

### Scenario 2: Clear Winner (5 participants)
1. 5 participants join and register
2. 3 vote for Alice
3. 1 votes for Bob
4. 1 votes for Charlie
**Expected**: Alice wins with 60%, Bob 20%, Charlie 20%

### Scenario 3: Three-Way Tie
1. 3 participants register
2. Each votes for themselves
**Expected**: Tie message with all three participants

### Scenario 4: No Votes
1. Multiple participants register
2. Nobody votes yet
**Expected**: Main stage shows "Esperant vots..." with 0 votes

### Scenario 5: Late Registration
1. Some participants register and vote
2. New participant registers late
3. New participant votes
**Expected**: New participant appears in list, vote counted

---

## 🐛 Common Issues & Solutions

### Issue: Button stays disabled in local testing
**Solution**: This is expected. Meet SDK requires actual Meet context. Test in Google Meet instead.

### Issue: "Side Panel is not yet initialized" error
**Solution**: Wait a moment for the SDK to initialize, or refresh the page.

### Issue: Main stage shows loading forever
**Solution**:
- Check browser console for errors
- Ensure starting state was passed correctly
- Verify Meet SDK is loaded

### Issue: Votes not appearing on main stage
**Solution**:
- Check browser console for message parsing errors
- Verify JSON.stringify/parse is working
- Check network tab for frame-to-frame messages

### Issue: Dark mode looks broken
**Solution**: Ensure Tailwind dark mode classes are applied and system/browser dark mode is enabled.

### Issue: Can't register participants
**Solution**:
- Check that activity was started (not just opened)
- Verify participant name is valid (1-50 characters)
- Check browser console for errors

---

## 📊 What to Check

### Visual Testing Checklist

**Landing Page**:
- [ ] Loads without errors
- [ ] Title in Catalan
- [ ] Responsive on mobile/tablet
- [ ] Dark mode works
- [ ] Gradient background displays

**Setup Side Panel**:
- [ ] Clean layout
- [ ] Instructions clear
- [ ] Button styled correctly
- [ ] Loading states work

**Activity Side Panel**:
- [ ] Registration form appears
- [ ] Validation works (empty names rejected)
- [ ] Participant list displays after registration
- [ ] Radio buttons work
- [ ] Vote button disabled until selection
- [ ] Confirmation message after voting
- [ ] All text in Catalan

**Main Stage**:
- [ ] Results display correctly
- [ ] Bars animate smoothly
- [ ] Winner highlighted
- [ ] Tie detected and displayed
- [ ] Responsive layout
- [ ] Real-time updates work

### Functional Testing Checklist

**Registration**:
- [ ] Participants can enter names
- [ ] Names appear on main stage
- [ ] Duplicate registrations handled
- [ ] Name validation works

**Voting**:
- [ ] Can select any participant
- [ ] Can submit vote
- [ ] Can only vote once
- [ ] Confirmation appears after voting

**Results**:
- [ ] Vote counts accurate
- [ ] Percentages calculate correctly
- [ ] Bars show proportionally
- [ ] Winner identified correctly
- [ ] Tie detected correctly
- [ ] Real-time updates happen

**Edge Cases**:
- [ ] 1 participant works
- [ ] 10+ participants work
- [ ] Long names display correctly
- [ ] All vote for same person
- [ ] Nobody votes (0 votes displayed)

---

## 📱 Device Testing

Test on multiple devices:
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Desktop Safari
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)
- [ ] Tablet

---

## 🔍 Debugging Tips

### Enable Console Logging
Check browser console for:
- Initialization messages
- Frame-to-frame messages
- Error messages
- State updates

### Network Tab
- Check for API calls to Meet SDK
- Verify frame-to-frame messages being sent
- Look for failed requests

### React DevTools
- Inspect component state
- Check prop values
- Verify re-renders

### Common Console Errors to Watch For
```
"Side Panel is not yet initialized!"
→ Wait for initialization or check Meet context

"Error parsing poll state"
→ Check JSON format in additionalData

"Error handling frame-to-frame message"
→ Check message structure matches PollMessage type
```

---

## ✅ Test Sign-Off

Once all tests pass:
- [ ] All pages load correctly
- [ ] All components display properly
- [ ] Registration works
- [ ] Voting works
- [ ] Results calculate correctly
- [ ] Real-time updates work
- [ ] All text in Catalan
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] No console errors
- [ ] Works in actual Google Meet call

---

## 🎯 Next Steps After Testing

1. **Fix any bugs found**
2. **Test with larger groups** (10+ participants)
3. **Performance testing** with many votes
4. **Implement tiebreaker** (if needed)
5. **Deploy to production** GitHub Pages
6. **User acceptance testing** with real users
7. **Gather feedback** and iterate

---

**Happy Testing! 🎨**

For questions or issues, check:
- `claude.md` - Full project context
- `DEVELOPMENT_PLAN.md` - Implementation details
- `IMPLEMENTATION_SUMMARY.md` - What was built
