interface WordChoice {
  word1: { word: string; clues: number };
  word2: { word: string; clues: number };
}

interface WordChoicePhaseProps {
  wordChoices: WordChoice;
  onWordChoice: (word: string) => void;
}

export const WordChoicePhase = ({
  wordChoices,
  onWordChoice,
}: WordChoicePhaseProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {wordChoices && (
        <>
          {[wordChoices.word1, wordChoices.word2].map((w, index) => (
            <button
              key={index}
              onClick={() => onWordChoice(w.word)}
              className="p-4 bg-card border border-border rounded-xl hover:bg-primary/10 hover:border-primary transition-all duration-200 cursor-pointer text-left"
            >
              <div className="text-lg font-semibold text-primary">{w.word}</div>
              <div className="text-sm text-muted-foreground">
                {w.clues} indices requis
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  );
};
