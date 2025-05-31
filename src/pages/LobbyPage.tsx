import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";
import { HomeLink } from "../components/HomeLink";

interface Message {
  sender: string;
  content: string;
}

export default function LobbyPage() {
  const {
    socket,
    isConnected,
    isConnecting,
    sendMessage,
    currentPlayerId,
    players,
    roomCode,
    addMessageHandler,
    removeMessageHandler,
  } = useWebSocket();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [totalRounds, setTotalRounds] = useState(2);

  useEffect(() => {
    const handleMessage = (data: any) => {
      switch (data.type) {
        case "welcome":
          setMessages((prev) => [
            ...prev,
            { sender: "System", content: data.message },
          ]);
          break;
        case "player_joined":
          setMessages((prev) => [
            ...prev,
            {
              sender: "System",
              content: `${data.player.pseudo} a rejoint la partie.`,
            },
          ]);
          break;
        case "player_left":
          setMessages((prev) => [
            ...prev,
            {
              sender: "System",
              content: `${data.player.pseudo} a quitté la partie.`,
            },
          ]);
          break;
        case "lobby_message":
          setMessages((prev) => [
            ...prev,
            { sender: data.player.pseudo, content: data.message },
          ]);
          break;
        case "game_started":
          navigate(`/game/${roomCode}`);
          break;
        case "owner_changed":
          setMessages((prev) => [
            ...prev,
            {
              sender: "System",
              content: `${data.player.pseudo} est le nouvel owner de la room.`,
            },
          ]);
          break;
        case "error":
          console.error("Erreur WebSocket:", data.message);
          if (data.message === "Session invalide") navigate("/");
          break;
      }
    };

    addMessageHandler(handleMessage);
    return () => removeMessageHandler(handleMessage);
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage({ type: "message", message: messageInput });
      setMessageInput("");
    }
  };

  const isOwner = players.find((p) => p.id === currentPlayerId)?.is_owner;
  const canStartGame = players.length >= 3;

  return (
    <div className="min-h-screen bg-background text-text px-4 py-6">
      {/* Lien de retour */}
      <HomeLink />

      <div className="max-w-5xl mx-auto mt-20 bg-background text-text p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Lobby : {roomCode}
        </h1>

        {/* Connexion state */}
        {isConnecting ? (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 rounded">
            Connexion au serveur en cours...
          </div>
        ) : !isConnected ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            Connexion perdue. Reconnexion...
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Liste joueurs */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-2">Joueurs</h2>
            <div className="bg-background text-text p-4 rounded-lg shadow-sm border border-border">
              {players.length === 0 ? (
                <p className="text-gray-500">Aucun joueur connecté</p>
              ) : (
                <ul className="space-y-2">
                  {players.map((player) => (
                    <li
                      key={player.id}
                      className="flex items-center justify-between"
                    >
                      <span>{player.pseudo}</span>
                      {player.is_owner && (
                        <span className="text-xs bg-primary text-background px-2 py-1 rounded-full">
                          Owner
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {isOwner && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Nombre de tours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={totalRounds}
                    onChange={(e) => setTotalRounds(parseInt(e.target.value))}
                    className="range-slider"
                  />
                  <span className="w-8 text-center">{totalRounds}</span>
                </div>
              </div>
            )}

            {isOwner && (
              <button
                onClick={() =>
                  socket?.readyState === WebSocket.OPEN &&
                  socket.send(
                    JSON.stringify({ type: "start_game", totalRounds })
                  )
                }
                disabled={!canStartGame}
                className={`mt-4 w-full py-2 px-4 rounded-full font-bold transition-all ${
                  canStartGame
                    ? "bg-primary text-background hover:bg-accent hover:cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {canStartGame
                  ? "Démarrer la partie"
                  : `En attente de joueurs (${players.length}/3)`}
              </button>
            )}
          </div>

          {/* Chat */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Chat</h2>
            <div className="bg-background text-text p-4 rounded-lg shadow-sm border border-border h-96 overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{msg.sender}:</span>{" "}
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 px-4 py-2 rounded-full border border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
              <button
                onClick={handleSendMessage}
                disabled={!isConnected}
                className="bg-primary text-background px-6 py-2 rounded-full font-bold hover:bg-accent hover:cursor-pointer transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
