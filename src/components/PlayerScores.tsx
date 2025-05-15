interface PlayerScoresProps {
  players: Array<{
    id: string;
    pseudo: string;
    score: number;
    is_owner: boolean;
  }>;
  currentPlayer: string;
}

export const PlayerScores = ({ players, currentPlayer }: PlayerScoresProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {players.map((player) => (
        <div
          key={player.id}
          className={`text-center p-4 rounded-lg border border-border shadow-sm ${
            player.id === currentPlayer
              ? "bg-accent text-background"
              : "bg-card"
          }`}
        >
          <div className="font-bold text-lg">{player.pseudo}</div>
          <div className="text-2xl font-semibold">{player.score || 0}</div>
        </div>
      ))}
    </div>
  );
};
