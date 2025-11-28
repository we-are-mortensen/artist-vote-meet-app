/**
 * Displays the poll question in Catalan
 * Question: "Who is today's artist?" (Qui és l'artista d'avui?)
 */

type PollQuestionProps = {
  /** Optional subtitle or additional description in Catalan */
  subtitle?: string;
  /** Optional round number for display (e.g., "Ronda 2" for tiebreakers) */
  round?: number;
};

export default function PollQuestion({
  subtitle,
  round = 1,
}: PollQuestionProps) {
  return (
    <div className="poll-question mb-6 text-center">
      {round > 1 && (
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Ronda {round} - Desempat
        </div>
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Qui és l&apos;artista d&apos;avui?
      </h1>
      {subtitle && (
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
