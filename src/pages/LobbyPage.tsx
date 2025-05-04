import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";

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
            {
              sender: data.player.pseudo,
              content: data.message,
            },
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
          if (data.message === "Session invalide") {
            navigate("/");
          }
          break;
      }
    };

    addMessageHandler(handleMessage);
    return () => removeMessageHandler(handleMessage);
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage({
        type: "message",
        message: messageInput,
      });
      setMessageInput("");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Room: {roomCode}</h1>

      {isConnecting ? (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
          Connexion au serveur en cours...
        </div>
      ) : (
        !isConnected && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            Connexion au serveur perdue. Tentative de reconnexion...
          </div>
        )
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <h2 className="text-xl font-semibold mb-2">Joueurs</h2>
          <div className="bg-gray-50 p-4 rounded">
            {players.length === 0 ? (
              <p className="text-gray-500">Aucun joueur connecté</p>
            ) : (
              <ul className="space-y-2">
                {players.map((player) => (
                  <li
                    key={player.id}
                    className="flex items-center justify-between"
                  >
                    {player.pseudo}
                    {player.is_owner && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Owner
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {players.find(
            (player) => player.id === currentPlayerId && player.is_owner
          ) && (
            <button
              onClick={() => {
                if (socket && socket.readyState === WebSocket.OPEN) {
                  socket.send(
                    JSON.stringify({
                      type: "start_game",
                    })
                  );
                }
              }}
              disabled={players.length < 3}
              className={`mt-4 w-full py-2 px-4 rounded font-medium ${
                players.length >= 3
                  ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {players.length >= 3
                ? "Démarrer la partie"
                : `En attente de joueurs (${players.length}/3)`}
            </button>
          )}
        </div>

        <div className="col-span-2">
          <h2 className="text-xl font-semibold mb-2">Chat</h2>
          <div className="bg-gray-50 p-4 rounded mb-4 h-96 overflow-y-auto">
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
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={handleSendMessage}
              disabled={!isConnected}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
