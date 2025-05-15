interface GuessListProps {
  currentGuesses: Array<{ playerId: string; word: string; timestamp: string }>;
  guesses: Array<{ playerId: string; word: string; timestamp: string }>;
  players: Array<{ id: string; pseudo: string }>;
}

export const GuessList = ({
  currentGuesses,
  guesses,
  players,
}: GuessListProps) => (
  <>
    <div className="mt-6">
      <h3 className="font-bold mb-2">Tentatives de ce tour :</h3>
      <div className="flex flex-col gap-2">
        {currentGuesses
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          .map((guess, index) => (
            <div
              key={index}
              className="bg-card border border-border px-3 py-2 rounded-lg flex justify-between items-center"
            >
              <div>
                <span className="font-medium text-primary">
                  {players.find((p) => p.id === guess.playerId)?.pseudo}
                </span>
                : {guess.word}
              </div>
            </div>
          ))}
      </div>
    </div>

    {guesses.length > 0 && (
      <div className="mt-6">
        <h3 className="font-bold mb-2">Historique des tentatives :</h3>
        <div className="flex flex-col gap-2">
          {guesses
            .sort(
              (a, b) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
            )
            .map((guess, index) => (
              <div
                key={index}
                className="bg-card border border-border px-3 py-2 rounded-lg flex justify-between items-center"
              >
                <div>
                  <span className="font-medium text-primary">
                    {players.find((p) => p.id === guess.playerId)?.pseudo}
                  </span>
                  : {guess.word}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(guess.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
        </div>
      </div>
    )}
  </>
);
