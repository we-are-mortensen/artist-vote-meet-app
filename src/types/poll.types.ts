/**
 * Type definitions for the Artist Vote polling system
 */

/**
 * Represents a participant in the Google Meet call
 */
export type Participant = {
  /** Unique identifier for the participant */
  id: string;
  /** Display name of the participant (in Catalan or as provided) */
  name: string;
};

/**
 * Represents a single vote cast by a participant
 */
export type Vote = {
  /** ID of the participant who cast the vote */
  voterId: string;
  /** Name of the voter (for display purposes) */
  voterName: string;
  /** ID of the participant who was voted for */
  selectedParticipantId: string;
  /** Unix timestamp when the vote was cast */
  timestamp: number;
};

/**
 * Overall state of the poll
 */
export type PollState = {
  /** List of all participants eligible to vote */
  participants: Participant[];
  /** All votes that have been cast */
  votes: Vote[];
  /** Current status of the poll */
  status: 'setup' | 'voting' | 'completed';
  /** Poll question (in Catalan) */
  question: string;
  /** ID of the poll (useful for tiebreaker rounds) */
  pollId: string;
  /** Round number (1 for initial, 2+ for tiebreakers) */
  round: number;
};

/**
 * Calculated results for a single participant
 */
export type VoteResult = {
  /** ID of the participant */
  participantId: string;
  /** Name of the participant */
  participantName: string;
  /** Number of votes received */
  voteCount: number;
  /** Percentage of total votes (0-100) */
  percentage: number;
  /** List of voter names who voted for this participant */
  voters: string[];
};

/**
 * Complete voting results
 */
export type VoteResults = {
  /** Results for each participant, sorted by vote count descending */
  results: VoteResult[];
  /** Total number of votes cast */
  totalVotes: number;
  /** Whether there's a tie for first place */
  hasTie: boolean;
  /** Participants who are tied (if any) */
  tiedParticipants: Participant[];
  /** The winner (if no tie) */
  winner: VoteResult | null;
};

/**
 * Message types for frame-to-frame communication
 */
export type MessageType =
  | 'PARTICIPANT_JOINED'
  | 'VOTE_CAST'
  | 'POLL_STARTED'
  | 'POLL_COMPLETED'
  | 'STATE_UPDATE';

/**
 * Frame-to-frame message structure
 */
export type PollMessage = {
  /** Type of message being sent */
  type: MessageType;
  /** Message payload */
  payload: Vote | Participant | PollState | any;
  /** Timestamp when message was sent */
  timestamp: number;
};

/**
 * Props for participant registration
 */
export type ParticipantRegistration = {
  /** Name entered by the participant */
  name: string;
  /** Unique ID generated for the participant */
  id: string;
};
