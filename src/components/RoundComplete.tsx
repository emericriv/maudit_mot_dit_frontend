interface RoundCompleteProps {
  roundData: {
    winner: { id: string; pseudo: string };
    cluesCount: number;
    requiredClues: number;
    word: string;
    currentPlayer: { id: string; pseudo: string };
    perfect: boolean;
  };
  isOwner: boolean;
  onNextRound: () => void;
}

export const RoundComplete: React.FC<RoundCompleteProps> = ({
  roundData,
  isOwner,
  onNextRound,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border-2 border-blue-200">
      <h2 className="text-xl font-bold mb-4">Round terminé !</h2>
      <p className="mb-2 text-green-600">
        {roundData.winner.pseudo} a trouvé le mot "{roundData.word}" en{" "}
        {roundData.cluesCount} indices !
      </p>
      {roundData.perfect ? (
        <p className="text-green-600 mb-4">
          C'était exactement le nombre d'indices nécessaires ! Les deux joueurs
          gagnent {roundData.cluesCount} points !
        </p>
      ) : (
        <p className="text-orange-600 mb-4">
          Le mot a été trouvé plus rapidement que prévu.{" "}
          {roundData.currentPlayer.pseudo} ne gagne donc pas de points.
        </p>
      )}

      {isOwner && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onNextRound}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors cursor-pointer"
          >
            Passer au round suivant
          </button>
        </div>
      )}
    </div>
  );
};
