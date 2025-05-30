import { WordChoice } from "../services/apiServices";

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
              className="relative p-4 bg-card border border-border rounded-xl hover:bg-primary/10 hover:border-primary transition-all duration-200 cursor-pointer text-left"
            >
              <div className="text-lg font-semibold text-primary">{w.word}</div>
              <div className="text-sm text-muted-foreground">
                {w.clues} indices requis
              </div>
              {w.malus && (
                <div className="absolute right-1/20 bottom-0 translate-y-[50%] bg-primary text-background text-xs px-2 py-1 rounded">
                  -1 point pour un autre joueur
                </div>
              )}
            </button>
          ))}
        </>
      )}
    </div>
  );
};
