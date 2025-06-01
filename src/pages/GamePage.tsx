import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { PlayerScores } from "../components/PlayerScores";
import { GameHeader } from "../components/GameHeader";
import { CluesList } from "../components/ClueList";
import { GuessList } from "../components/GuessList";
import { RoundComplete } from "../components/RoundComplete";
import { GamePhases } from "../components/GamePhases";
import { Toaster, toast } from "react-hot-toast";
import { GameEndPage } from "./GameEndPage";
import { Player, RoundCompleteData, WordChoice } from "../services/apiServices";
import { RoundIndicator } from "../components/RoundIndicator";
import { AnimatedDots } from "../components/AnimatedDots";

interface GameState {
  phase: "choice" | "clue" | "guess";
  currentPlayer: string;
  timeLeft: number;
  wordChoices: WordChoice | null;
  selectedWord: string;
  requiredClues: number;
  givenClues: string[];
  currentGuesses: Array<{
    playerId: string;
    word: string;
    timestamp: string;
  }>;
  guesses: Array<{
    playerId: string;
    word: string;
    timestamp: string;
  }>;
  roundComplete: RoundCompleteData | null;
  currentRound: number;
  totalRounds: number;
}

export default function GamePage() {
  const {
    isConnected,
    isConnecting,
    currentPlayerId,
    players,
    playerOrder,
    addMessageHandler,
    removeMessageHandler,
    sendMessage,
    roomCode,
  } = useWebSocket();
  const [gameEnded, setGameEnded] = useState(false);
  const [finalPlayers, setFinalPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    phase: "choice",
    currentPlayer: "",
    timeLeft: 30,
    wordChoices: null,
    selectedWord: "",
    requiredClues: 0,
    givenClues: [],
    currentGuesses: [],
    guesses: [],
    roundComplete: null,
    currentRound: 1,
    totalRounds: 2,
  });

  // WebSocket message handler
  useEffect(() => {
    const handleMessage = (data: any) => {
      console.log("Message reçu :", data);
      switch (data.type) {
        case "game_started":
          setGameEnded(false);
          setGameState((prev) => ({
            ...prev,
            currentPlayer: data.currentPlayer,
            wordChoices: data.wordChoices,
            timeLeft: data.timeLeft,
            phase: data.phase || "choice",
            givenClues: data.givenClues || [],
            guesses: data.guesses || [],
            requiredClues: data.requiredClues || 0,
            currentRound: data.currentRound || 1,
            totalRounds: data.totalRounds || 2,
            currentGuesses: [],
            roundComplete: null,
          }));
          break;

        case "timer_update":
          setGameState((prev) => ({
            ...prev,
            timeLeft: data.timeLeft,
            phase: data.phase,
            currentPlayer: data.currentPlayer,
          }));
          break;

        case "word_selected":
          setGameState((prev) => ({
            ...prev,
            phase: "clue",
            selectedWord: data.word,
            requiredClues: data.required_clues,
            timeLeft: 60,
          }));
          break;

        case "clue_given":
          setGameState((prev) => ({
            ...prev,
            phase: "guess",
            givenClues: [...prev.givenClues, data.clue],
            timeLeft: 60,
            currentGuesses: [],
            guesses: prev.guesses,
          }));
          break;

        case "guess_made":
          setGameState((prev) => ({
            ...prev,
            currentGuesses: [
              ...prev.currentGuesses,
              {
                playerId: data.playerId,
                word: data.guess,
                timestamp: data.timestamp,
              },
            ],
            guesses: data.allGuesses,
          }));
          break;

        case "round_complete":
          console.log("data.winner:", data.winner, "data:", data);
          if (data.malusApplied) {
            setGameState((prev) => ({
              ...prev,
              roundComplete: prev.roundComplete
                ? { ...prev.roundComplete, canMalus: false }
                : null,
            }));
            toast.success(data.message);
          } else {
            setGameState((prev) => ({
              ...prev,
              roundComplete: {
                winner: data.winner,
                cluesCount: data.cluesCount,
                requiredClues: data.requiredClues,
                canMalus: data.canMalus,
                word: data.word,
                currentPlayer: data.currentPlayer,
                perfect: data.perfect,
              },
            }));
          }
          break;

        case "new_round":
          console.log("Tour terminé", data);
          setGameState({
            phase: "choice",
            currentPlayer: data.nextPlayer,
            timeLeft: 30,
            wordChoices: data.wordChoices,
            selectedWord: "",
            requiredClues: 0,
            givenClues: [],
            currentGuesses: [],
            guesses: [],
            roundComplete: null,
            currentRound: data.currentRound,
            totalRounds: data.totalRounds,
          });
          break;
        case "game_end":
          setGameEnded(true);
          setFinalPlayers(data.players);
          break;
        case "error":
          toast.error(data.message);
          break;
      }
    };

    addMessageHandler(handleMessage);
    return () => removeMessageHandler(handleMessage);
  }, []);

  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: "join_game" });
    }
  }, [isConnected]);

  if (gameEnded) {
    return <GameEndPage players={finalPlayers} roomCode={roomCode} />;
  }

  const handleWordChoice = (word: string) => {
    sendMessage({
      type: "word_choice",
      word,
    });
  };

  const handleClueSubmit = (clue: string) => {
    sendMessage({
      type: "give_clue",
      clue,
    });
  };

  const handleGuess = (guess: string) => {
    sendMessage({
      type: "make_guess",
      guess,
    });
  };

  const getPhaseMessage = () => {
    const isCurrentPlayer = gameState.currentPlayer === currentPlayerId;
    const currentPlayerPseudo = players.find(
      (p) => p.id === gameState.currentPlayer
    )?.pseudo;

    switch (gameState.phase) {
      case "choice":
        if (isCurrentPlayer) {
          return "C'est à vous de choisir un mot !";
        }
        if (currentPlayerPseudo) {
          return (
            <>
              {currentPlayerPseudo} choisit un mot <AnimatedDots />
            </>
          );
        }
        return "Sélection du joueur en cours...";
      case "clue":
        if (isCurrentPlayer) {
          return "Donnez un indice pour faire deviner votre mot !";
        }
        return (
          <>
            {currentPlayerPseudo} donne un indice <AnimatedDots />
          </>
        );
      case "guess":
        if (isCurrentPlayer) {
          return (
            <>
              Attendez que les autres joueurs devinent <AnimatedDots />
            </>
          );
        }
        return "À vous de deviner le mot !";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background text-text px-4 py-6">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#291f44", // fond violet foncé
            color: "#fff", // texte blanc
            borderRadius: "1rem",
            border: "2px solid #feca26",
            fontWeight: 600,
            fontFamily: "inherit",
            boxShadow: "0 4px 24px 0 rgba(46, 16, 101, 0.15)",
          },
          success: {
            iconTheme: {
              primary: "#feca26", // jaune
              secondary: "#291f44",
            },
            style: {
              background: "#feca26", // toast succès jaune
              color: "#291f44", // texte violet foncé
              border: "2px solid #291f44",
            },
          },
          error: {
            iconTheme: {
              primary: "#e53e3e", // rouge
              secondary: "#291f44",
            },
            style: {
              background: "#291f44", // toast erreur rouge
              color: "#feca26",
              border: "2px solid #feca26",
            },
          },
        }}
      />
      {/* Connexion status */}
      {isConnecting ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-4">
          Connexion en cours...
        </div>
      ) : (
        !isConnected && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-4">
            Connexion perdue
          </div>
        )
      )}

      <div className="flex justify-between items-center mb-6">
        <PlayerScores
          players={players.map((player) => ({
            ...player,
            score: player.score ?? 0,
          }))}
          currentPlayer={gameState.currentPlayer}
          playerOrder={playerOrder}
        />
        <RoundIndicator
          currentRound={gameState.currentRound}
          totalRounds={gameState.totalRounds}
        />
      </div>

      <div className="bg-muted text-text rounded-xl shadow-md border border-border p-6 mb-6">
        <div className="mt-4">
          {gameState.roundComplete ? (
            <RoundComplete
              roundData={gameState.roundComplete}
              isOwner={
                players.find((p) => p.id === currentPlayerId)?.is_owner ?? false
              }
              onNextRound={() => sendMessage({ type: "start_new_round" })}
              isLastRound={gameState.currentRound === gameState.totalRounds}
              isLastPlayer={
                // Vérifie si le joueur actuel est le dernier de la liste
                playerOrder.length > 0 &&
                gameState.currentPlayer === playerOrder[playerOrder.length - 1]
              }
            />
          ) : (
            <>
              <GameHeader
                timeLeft={gameState.timeLeft}
                requiredClues={gameState.requiredClues}
                givenClues={gameState.givenClues}
                currentPlayer={gameState.currentPlayer}
                currentPlayerId={currentPlayerId}
                phaseMessage={getPhaseMessage()}
              />
              <GamePhases
                phase={gameState.phase}
                gameState={gameState}
                currentPlayerId={currentPlayerId}
                onWordChoice={handleWordChoice}
                onClueSubmit={handleClueSubmit}
                onGuess={handleGuess}
              />
            </>
          )}
        </div>

        <CluesList givenClues={gameState.givenClues} />
        <GuessList
          currentGuesses={gameState.currentGuesses}
          guesses={gameState.guesses}
          players={players}
        />
      </div>
    </div>
  );
}
