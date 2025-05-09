import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

interface WordChoice {
  word1: { word: string; clues: number };
  word2: { word: string; clues: number };
}

interface GameState {
  phase: "choice" | "clue" | "guess";
  currentPlayer: string;
  timeLeft: number;
  wordChoices: WordChoice | null;
  selectedWord: string;
  requiredClues: number;
  givenClues: string[];
  guesses: Array<{ playerId: string; word: string }>;
}

export default function GamePage() {
  const {
    isConnected,
    isConnecting,
    currentPlayerId,
    players,
    addMessageHandler,
    removeMessageHandler,
    sendMessage,
  } = useWebSocket();

  const [gameState, setGameState] = useState<GameState>({
    phase: "choice",
    currentPlayer: "",
    timeLeft: 30,
    wordChoices: null,
    selectedWord: "",
    requiredClues: 0,
    givenClues: [],
    guesses: [],
  });

  useEffect(() => {
    sendMessage({ type: "join_game" });
  }, []);

  // WebSocket message handler
  useEffect(() => {
    const handleMessage = (data: any) => {
      console.log("Received message:", data);
      switch (data.type) {
        case "game_started":
          setGameState((prev) => ({
            ...prev,
            currentPlayer: data.currentPlayer,
            wordChoices: data.wordChoices,
            timeLeft: data.timeLeft,
            phase: "choice",
            givenClues: [],
            guesses: [],
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
            guesses: [],
          }));
          break;

        case "guess_made":
          setGameState((prev) => ({
            ...prev,
            guesses: [
              ...prev.guesses,
              { playerId: data.playerId, word: data.guess },
            ],
          }));
          break;

        case "turn_end":
          setGameState({
            phase: "choice",
            currentPlayer: data.nextPlayer,
            timeLeft: 30,
            wordChoices: data.wordChoices,
            selectedWord: "",
            requiredClues: 0,
            givenClues: [],
            guesses: [],
          });
          break;
      }
    };

    addMessageHandler(handleMessage);
    return () => removeMessageHandler(handleMessage);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Status de connexion */}
      {isConnecting ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
          Connexion en cours...
        </div>
      ) : (
        !isConnected && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            Connexion perdue
          </div>
        )
      )}

      {/* Scores des joueurs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {players.map((player) => (
          <div
            key={player.id}
            className={`text-center p-4 rounded-lg ${
              player.id === gameState.currentPlayer ? "bg-blue-100" : "bg-white"
            }`}
          >
            <div className="font-bold">{player.pseudo}</div>
            <div className="text-2xl">{player.score || 0}</div>
          </div>
        ))}
      </div>

      {/* Zone de jeu principale */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl">Phase : {gameState.phase}</div>
          <div className="text-xl font-bold">
            Temps restant : {gameState.timeLeft}s
          </div>
          {gameState.requiredClues > 0 && (
            <div className="text-lg">
              Indices requis : {gameState.requiredClues}
            </div>
          )}
        </div>

        {/* Zone de jeu active */}
        <div className="mt-4">
          {/* Phase de choix du mot */}
          {gameState.phase === "choice" &&
            gameState.currentPlayer === currentPlayerId &&
            gameState.wordChoices && (
              <div className="grid grid-cols-2 gap-4">
                {gameState.phase === "choice" &&
                  gameState.currentPlayer === currentPlayerId && (
                    <div className="grid grid-cols-2 gap-4">
                      {gameState.wordChoices && (
                        <>
                          <button
                            onClick={() =>
                              handleWordChoice(
                                gameState.wordChoices!.word1.word
                              )
                            }
                            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
                          >
                            {gameState.wordChoices.word1.word}
                            <div className="text-sm text-gray-600">
                              {gameState.wordChoices.word1.clues} indices requis
                            </div>
                          </button>
                          <button
                            onClick={() =>
                              handleWordChoice(
                                gameState.wordChoices!.word2.word
                              )
                            }
                            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100"
                          >
                            {gameState.wordChoices.word2.word}
                            <div className="text-sm text-gray-600">
                              {gameState.wordChoices.word2.clues} indices requis
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  )}
              </div>
            )}

          {/* Phase d'indice */}
          {gameState.phase === "clue" &&
            gameState.currentPlayer === currentPlayerId && (
              <div className="text-center">
                <p className="mb-2">
                  Donnez un indice pour faire deviner le mot :{" "}
                  <strong>{gameState.selectedWord}</strong>
                </p>
                <input
                  type="text"
                  placeholder="Tapez votre indice..."
                  className="w-full p-2 border rounded"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleClueSubmit(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            )}

          {/* Phase de devinette */}
          {gameState.phase === "guess" &&
            gameState.currentPlayer !== currentPlayerId &&
            !gameState.guesses.some((g) => g.playerId === currentPlayerId) && (
              <div className="text-center">
                <p className="mb-2">Devinez le mot à partir des indices :</p>
                <input
                  type="text"
                  placeholder="Proposez votre mot..."
                  className="w-full p-2 border rounded"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleGuess(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            )}
        </div>

        {/* Zone des indices donnés */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">Indices donnés :</h3>
          <div className="flex flex-wrap gap-2">
            {gameState.givenClues.map((clue, index) => (
              <div key={index} className="bg-blue-100 px-3 py-1 rounded-full">
                {clue}
              </div>
            ))}
          </div>
        </div>

        {/* Zone des tentatives */}
        {gameState.guesses.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold mb-2">Tentatives :</h3>
            <div className="flex flex-wrap gap-2">
              {gameState.guesses.map((guess, index) => (
                <div key={index} className="bg-gray-100 px-3 py-1 rounded-full">
                  {players.find((p) => p.id === guess.playerId)?.pseudo}:{" "}
                  {guess.word}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
