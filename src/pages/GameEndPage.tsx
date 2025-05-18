import { Link } from "react-router-dom";
import { Player } from "../services/apiServices";

export const GameEndPage: React.FC<{ players: Player[]; roomCode: string }> = ({
  players,
  roomCode,
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🎉 Fin de la partie !
        </h1>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {winner.pseudo} remporte la partie avec {winner.score} points !
          </h2>

          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index === 0 ? "bg-yellow-100 text-background" : "bg-card"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {index === 0
                      ? "🏆"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : ""}
                  </span>
                  <span className="font-bold">{player.pseudo}</span>
                </div>
                <span className="text-xl font-bold">{player.score} points</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            to={`/lobby/${roomCode}`}
            className="inline-block bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/80 transition"
          >
            Retour au lobby
          </Link>
        </div>
      </div>
    </div>
  );
};
