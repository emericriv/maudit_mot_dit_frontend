interface GameHeaderProps {
  timeLeft: number;
  requiredClues: number;
  givenClues: string[];
  currentPlayer: string;
  currentPlayerId: string;
  phaseMessage: string;
  currentRound: number;
  totalRounds: number;
}

export const GameHeader = ({
  timeLeft,
  requiredClues,
  givenClues,
  currentPlayer,
  currentPlayerId,
  phaseMessage,
  currentRound,
  totalRounds,
}: GameHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div className="text-xl font-bold">⏳ Temps restant : {timeLeft}s</div>
      <div className="text-sm text-muted-foreground">
        Tour {currentRound}/{totalRounds}
      </div>

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
          <span className="text-sm text-muted-foreground">
            ({givenClues.length}/{requiredClues})
          </span>
        </div>
      )}

      <div className="text-xl text-primary font-medium text-center w-full mt-2">
        {phaseMessage}
      </div>
    </div>
  );
};
