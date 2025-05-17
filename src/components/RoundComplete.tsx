interface RoundCompleteProps {
  roundData: {
    winner?: { id: string; pseudo: string };
    clueMissing?: boolean;
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
    <div className="bg-success/10 border border-success text-success p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Round terminé !</h2>

      {roundData.winner ? (
        <>
          <h3 className="text-2xl font-bold mb-4">
            {roundData.winner.pseudo} a trouvé le mot !
          </h3>
          <p className="mb-2">
            {roundData.winner.pseudo} a trouvé le mot "
            <strong>{roundData.word}</strong>" en {roundData.cluesCount} indice
            {roundData.cluesCount > 1 ? "s" : ""}!
          </p>
          {roundData.perfect ? (
            <p className="mb-4">
              🟢 Parfait ! Les deux joueurs gagnent {roundData.requiredClues}{" "}
              point
              {roundData.requiredClues > 1 ? "s" : ""}.
            </p>
          ) : (
            <p className="text-warning mb-4">
              ⚠️ {roundData.requiredClues} indice
              {roundData.requiredClues > 1 ? "s" : ""} étai
              {roundData.requiredClues > 1 ? "en" : ""}t attendu
              {roundData.requiredClues > 1 ? "s" : ""} :{" "}
              {roundData.currentPlayer.pseudo} ne gagne pas de points.
            </p>
          )}
        </>
      ) : roundData.clueMissing ? (
        <>
          <h3 className="text-2xl font-bold mb-4 text-red-500">
            Personne n'a trouvé le mot !
          </h3>
          <p className="mb-2">Le mot était : {roundData.word}</p>
          <p className="mb-4">
            Il devait être deviné en {roundData.requiredClues} indice
            {roundData.requiredClues > 1 ? "s" : ""}
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold mb-4">
            {roundData.currentPlayer.pseudo} n'a pas donné d'indice !
          </h3>
          <p className="mb-2">
            {roundData.currentPlayer.pseudo} n'a pas donné d'indice pour le mot
            "<strong>{roundData.word}</strong>".
          </p>
          <p className="mb-4">
            ⚠️ {roundData.requiredClues} indice
            {roundData.requiredClues > 1 ? "s" : ""} étai
            {roundData.requiredClues > 1 ? "en" : ""}t attendu
            {roundData.requiredClues > 1 ? "s" : ""} :{" "}
            {roundData.currentPlayer.pseudo} perd donc autant de points.
          </p>
        </>
      )}
      {isOwner && (
        <div className="flex justify-center mt-4">
          <button
            onClick={onNextRound}
            className="bg-primary text-background py-2 px-6 rounded-full hover:bg-accent hover:cursor-pointer transition"
          >
            Passer au round suivant
          </button>
        </div>
      )}
    </div>
  );
};
