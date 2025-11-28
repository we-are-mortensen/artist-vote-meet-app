import type {
  Vote,
  Participant,
  VoteResult,
  VoteResults,
} from '../types/poll.types';

/**
 * Calculates voting results from a list of votes and participants
 * @param votes - Array of all votes cast
 * @param participants - Array of all participants
 * @returns Complete voting results with counts, percentages, and tie detection
 */
export function calculateResults(
  votes: Vote[],
  participants: Participant[]
): VoteResults {
  const totalVotes = votes.length;

  // Initialize results for each participant
  const resultMap = new Map<string, VoteResult>();
  participants.forEach((participant) => {
    resultMap.set(participant.id, {
      participantId: participant.id,
      participantName: participant.name,
      voteCount: 0,
      percentage: 0,
      voters: [],
    });
  });

  // Count votes for each participant
  votes.forEach((vote) => {
    const result = resultMap.get(vote.selectedParticipantId);
    if (result) {
      result.voteCount++;
      result.voters.push(vote.voterName);
    }
  });

  // Calculate percentages
  resultMap.forEach((result) => {
    result.percentage = totalVotes > 0 ? (result.voteCount / totalVotes) * 100 : 0;
  });

  // Convert to array and sort by vote count (descending)
  const results = Array.from(resultMap.values()).sort(
    (a, b) => b.voteCount - a.voteCount
  );

  // Detect ties and determine winner
  const maxVotes = results[0]?.voteCount || 0;
  const topResults = results.filter((r) => r.voteCount === maxVotes && maxVotes > 0);
  const hasTie = topResults.length > 1 && maxVotes > 0;
  const winner = !hasTie && maxVotes > 0 ? results[0] : null;

  const tiedParticipants: Participant[] = hasTie
    ? topResults.map((r) => ({
        id: r.participantId,
        name: r.participantName,
      }))
    : [];

  return {
    results,
    totalVotes,
    hasTie,
    tiedParticipants,
    winner,
  };
}

/**
 * Detects if there's a tie in the voting results
 * Returns the tied participants if there's a tie, null otherwise
 * @param results - Complete voting results
 * @returns Array of tied participants or null if no tie
 */
export function detectTie(results: VoteResults): Participant[] | null {
  return results.hasTie ? results.tiedParticipants : null;
}

/**
 * Sorts vote results by vote count in descending order
 * @param results - Array of vote results
 * @returns Sorted array of vote results
 */
export function sortByVoteCount(results: VoteResult[]): VoteResult[] {
  return [...results].sort((a, b) => b.voteCount - a.voteCount);
}

/**
 * Checks if a specific participant has already voted
 * @param votes - Array of all votes cast
 * @param participantId - ID of the participant to check
 * @returns true if the participant has voted, false otherwise
 */
export function hasParticipantVoted(
  votes: Vote[],
  participantId: string
): boolean {
  return votes.some((vote) => vote.voterId === participantId);
}

/**
 * Gets the vote cast by a specific participant
 * @param votes - Array of all votes cast
 * @param participantId - ID of the participant
 * @returns The vote object if found, undefined otherwise
 */
export function getParticipantVote(
  votes: Vote[],
  participantId: string
): Vote | undefined {
  return votes.find((vote) => vote.voterId === participantId);
}

/**
 * Generates a unique ID for a participant
 * Uses timestamp and random string for uniqueness
 * @returns Unique participant ID
 */
export function generateParticipantId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `participant_${timestamp}_${random}`;
}

/**
 * Generates a unique ID for a poll
 * @returns Unique poll ID
 */
export function generatePollId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `poll_${timestamp}_${random}`;
}

/**
 * Validates a participant name
 * @param name - Name to validate
 * @returns true if valid, false otherwise
 */
export function isValidParticipantName(name: string): boolean {
  return name.trim().length > 0 && name.trim().length <= 50;
}

/**
 * Calculates voting progress percentage
 * @param totalVotes - Number of votes cast
 * @param totalParticipants - Total number of participants
 * @returns Percentage of participants who have voted (0-100)
 */
export function calculateVotingProgress(
  totalVotes: number,
  totalParticipants: number
): number {
  if (totalParticipants === 0) return 0;
  return Math.round((totalVotes / totalParticipants) * 100);
}
