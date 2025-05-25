import { Link } from "react-router-dom";
import { Player } from "../services/apiServices";

export const GameEndPage: React.FC<{ players: Player[]; roomCode: string }> = ({
  players,
  roomCode,
}) => {
  // Trier les joueurs par score et créer un tableau avec leur position
  const playersWithRank = [...players]
    .sort((a, b) => b.score - a.score)
    .reduce((acc: (Player & { rank: number })[], player, idx, arr) => {
      // Si c'est le premier joueur
      if (idx === 0) {
        return [...acc, { ...player, rank: 1 }];
      }

      const previousPlayer = arr[idx - 1];
      const previousRank = acc[idx - 1].rank;

      // Si même score que le précédent, même rang
      if (previousPlayer.score === player.score) {
        return [...acc, { ...player, rank: previousRank }];
      }

      // Sinon, on prend le nombre de joueurs qui ont un meilleur score + 1
      const betterScores = new Set(arr.slice(0, idx).map((p) => p.score));
      return [...acc, { ...player, rank: betterScores.size + 1 }];
    }, []);

  // Trouver les gagnants (peuvent être plusieurs en cas d'égalité)
  const winners = playersWithRank.filter((p) => p.rank === 1);

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🎉 Fin de la partie !
        </h1>

        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {winners.length > 1
              ? `${winners
                  .map((w) => w.pseudo)
                  .join(
                    " et "
                  )} n'ont pas voulu lâcher la première place avec ${
                  winners[0].score
                } points !`
              : `${winners[0].pseudo} remporte la partie avec ${winners[0].score} points !`}
          </h2>

          <div className="space-y-4">
            {/* Grouper les joueurs par rang */}
            {Array.from(new Set(playersWithRank.map((p) => p.rank))).map(
              (rank) => {
                const playersAtRank = playersWithRank.filter(
                  (p) => p.rank === rank
                );

                return (
                  <div
                    key={rank}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      rank === 1 ? "bg-yellow-100 text-background" : "bg-card"
                    }`}
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <span className="text-2xl min-w-[2rem]">
                        {getMedal(rank)}
                      </span>
                      <div className="flex flex-wrap gap-x-4">
                        {playersAtRank.map((player, idx) => (
                          <>
                            <span key={player.id} className="font-bold">
                              {player.pseudo}
                            </span>
                            <span>
                              {idx < playersAtRank.length - 1 ? " • " : ""}
                            </span>
                          </>
                        ))}
                      </div>
                    </div>
                    <span className="text-xl font-bold ml-4">
                      {playersAtRank[0].score} points
                    </span>
                  </div>
                );
              }
            )}
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
