import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Player {
  id: string;
  pseudo: string;
  score: number;
}

interface WordChoice {
  word1: string;
  clues1: number;
  word2: string;
  clues2: number;
}

interface GameState {
  phase: "choice" | "clue" | "guess";
  currentPlayer: string;
  timeLeft: number;
  wordChoice?: WordChoice;
  selectedWord?: string;
  givenClues: string[];
  guesses: Array<{ playerId: string; word: string }>;
}

export default function GamePage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    phase: "choice",
    currentPlayer: "",
    timeLeft: 30,
    givenClues: [],
    guesses: [],
  });
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // ... Logique WebSocket similaire à LobbyPage

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-3 gap-4">
        {/* Scores des joueurs */}
        <div className="col-span-3 flex justify-around mb-8">
          {players.map((player) => (
            <div key={player.id} className="text-center">
              <div className="font-bold">{player.pseudo}</div>
              <div className="text-2xl">{player.score}</div>
            </div>
          ))}
        </div>

        {/* Zone principale de jeu */}
        <div className="col-span-3 bg-white rounded-lg shadow-lg p-6">
          {gameState.phase === "choice" && (
            <div className="text-center">
              <h2 className="text-xl mb-4">
                Choisissez un mot ({gameState.timeLeft}s)
              </h2>
              {/* Afficher les choix de mots */}
            </div>
          )}

          {gameState.phase === "clue" && (
            <div className="text-center">
              <h2 className="text-xl mb-4">
                Donnez un indice ({gameState.timeLeft}s)
              </h2>
              {/* Interface pour donner des indices */}
            </div>
          )}

          {gameState.phase === "guess" && (
            <div className="text-center">
              <h2 className="text-xl mb-4">
                Devinez le mot ! ({gameState.timeLeft}s)
              </h2>
              {/* Interface pour deviner */}
            </div>
          )}
        </div>

        {/* Zone des indices/propositions */}
        <div className="col-span-3 mt-4">
          <div className="flex flex-wrap gap-2">
            {gameState.givenClues.map((clue, index) => (
              <div key={index} className="bg-blue-100 px-3 py-1 rounded-full">
                {clue}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
