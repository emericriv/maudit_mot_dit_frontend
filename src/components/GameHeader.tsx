interface GameHeaderProps {
  timeLeft: number;
  requiredClues: number;
  givenClues: string[];
  currentPlayer: string;
  currentPlayerId: string;
  phaseMessage: string;
}

export const GameHeader = ({
  timeLeft,
  requiredClues,
  givenClues,
  currentPlayer,
  currentPlayerId,
  phaseMessage,
}: GameHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="text-xl font-bold">Temps restant : {timeLeft}s</div>
      {requiredClues > 0 && currentPlayer === currentPlayerId && (
        <div className="flex items-center gap-2 text-lg">
          <span>Indices :</span>
          <div className="flex gap-1">
            {Array.from({ length: requiredClues }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < givenClues.length ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({givenClues.length}/{requiredClues})
          </span>
        </div>
      )}
      <div className="text-center text-xl font-medium mb-4">{phaseMessage}</div>
    </div>
  );
};
