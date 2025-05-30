import { WordChoicePhase } from "./WordChoicePhase";
import { CluePhase } from "./CluePhase";
import { GuessPhase } from "./GuessPhase";
import { WordChoice } from "../services/apiServices";

interface GamePhasesProps {
  phase: "choice" | "clue" | "guess";
  gameState: {
    currentPlayer: string;
    wordChoices: WordChoice | null;
    selectedWord: string;
    currentGuesses: Array<{ playerId: string; word: string }>;
  };
  currentPlayerId: string;
  onWordChoice: (word: string) => void;
  onClueSubmit: (clue: string) => void;
  onGuess: (guess: string) => void;
}

export const GamePhases: React.FC<GamePhasesProps> = ({
  phase,
  gameState,
  currentPlayerId,
  onWordChoice,
  onClueSubmit,
  onGuess,
}) => {
  switch (phase) {
    case "choice":
      return gameState.currentPlayer === currentPlayerId &&
        gameState.wordChoices ? (
        <WordChoicePhase
          wordChoices={gameState.wordChoices}
          onWordChoice={onWordChoice}
        />
      ) : null;

    case "clue":
      return gameState.currentPlayer === currentPlayerId ? (
        <CluePhase
          selectedWord={gameState.selectedWord}
          onClueSubmit={onClueSubmit}
        />
      ) : null;

    case "guess":
      return gameState.currentPlayer !== currentPlayerId &&
        !gameState.currentGuesses.some(
          (g) => g.playerId === currentPlayerId
        ) ? (
        <GuessPhase onGuess={onGuess} />
      ) : null;

    default:
      return null;
  }
};
