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
    <div className="grid grid-cols-4 gap-4 mb-8">
      {players.map((player) => (
        <div
          key={player.id}
          className={`text-center p-4 rounded-lg ${
            player.id === currentPlayer ? "bg-blue-100" : "bg-white"
          }`}
        >
          <div className="font-bold">{player.pseudo}</div>
          <div className="text-2xl">{player.score || 0}</div>
        </div>
      ))}
    </div>
  );
};
