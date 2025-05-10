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
          <button
            onClick={() => onWordChoice(wordChoices!.word1.word)}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
          >
            {wordChoices.word1.word}
            <div className="text-sm text-gray-600">
              {wordChoices.word1.clues} indices requis
            </div>
          </button>
          <button
            onClick={() => onWordChoice(wordChoices!.word2.word)}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer"
          >
            {wordChoices.word2.word}
            <div className="text-sm text-gray-600">
              {wordChoices.word2.clues} indices requis
            </div>
          </button>
        </>
      )}
    </div>
  );
};
