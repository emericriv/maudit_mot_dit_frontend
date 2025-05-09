import { useEffect, useState } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";

interface WordChoice {
  word1: { word: string; clues: number };
  word2: { word: string; clues: number };
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

  const [gameState, setGameState] = useState({
    phase: "choice",
    currentPlayer: "",
    timeLeft: 30,
    wordChoices: null as WordChoice | null,
    selectedWord: "",
    givenClues: [] as string[],
    guesses: [] as Array<{ playerId: string; word: string }>,
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
            timeLeft: 30,
            phase: "choice",
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
            timeLeft: 60,
          }));
          break;

        case "clue_given":
          setGameState((prev) => ({
            ...prev,
            givenClues: [...prev.givenClues, data.clue],
          }));
          break;

        case "guess_made":
          setGameState((prev) => ({
            ...prev,
            guesses: [
              ...prev.guesses,
              {
                playerId: data.playerId,
                word: data.guess,
              },
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
        <div className="text-xl mb-4 text-center">
          Temps restant : {gameState.timeLeft}s
        </div>

        <p>Game state : {gameState.phase}</p>

        {gameState.phase === "choice" &&
          gameState.currentPlayer === currentPlayerId && (
            <div className="grid grid-cols-2 gap-4">
              {gameState.wordChoices && (
                <>
                  <button
                    onClick={() =>
                      handleWordChoice(gameState.wordChoices!.word1.word)
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
                      handleWordChoice(gameState.wordChoices!.word2.word)
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

        {gameState.phase === "clue" &&
          gameState.currentPlayer === currentPlayerId && (
            <div className="text-center">
              <input
                type="text"
                placeholder="Donnez un indice..."
                className="w-full p-2 border rounded"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClueSubmit(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          )}

        {gameState.phase !== "choice" &&
          gameState.currentPlayer !== currentPlayerId && (
            <div className="text-center">
              <input
                type="text"
                placeholder="Devinez le mot..."
                className="w-full p-2 border rounded"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGuess(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          )}
      </div>

      {/* Zone des indices */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="font-bold mb-4">Indices donnés :</h3>
        <div className="flex flex-wrap gap-2">
          {gameState.givenClues.map((clue, index) => (
            <div key={index} className="bg-blue-100 px-3 py-1 rounded-full">
              {clue}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
