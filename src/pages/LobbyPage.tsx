import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Player {
  id: string;
  pseudo: string;
  is_owner: boolean;
}

interface Message {
  sender: string;
  content: string;
}

export default function LobbyPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    // Récupérer les informations de session
    const sessionId = sessionStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("Session ID manquant");
      navigate("/");
      return;
    }

    if (!wsRef.current) {
      setIsConnecting(true);
      wsRef.current = new WebSocket(
        `${import.meta.env.VITE_WS_URL}/game/${roomCode}/`
      );
      setSocket(wsRef.current);

      wsRef.current.onopen = () => {
        console.log("Connecté au WebSocket");
        setIsConnected(true);
        setIsConnecting(false);
        // Envoyer les informations d'initialisation
        if (wsRef.current) {
          wsRef.current.send(
            JSON.stringify({
              type: "init",
              sessionId: sessionId,
            })
          );
        }
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Message reçu:", data);

        switch (data.type) {
          case "welcome":
            setMessages((prev) => [
              ...prev,
              { sender: "System", content: data.message },
            ]);
            break;

          case "player_joined":
            // Vérifier si le joueur n'existe pas déjà avant de l'ajouter
            setPlayers((prev) => {
              const playerExists = prev.some((p) => p.id === data.player.id);
              if (playerExists) return prev;
              return [...prev, data.player];
            });
            setMessages((prev) => [
              ...prev,
              {
                sender: "System",
                content: `${data.player.pseudo} a rejoint la partie.`,
              },
            ]);
            break;

          case "player_left":
            setPlayers((prev) => prev.filter((p) => p.id !== data.player.id));
            setMessages((prev) => [
              ...prev,
              {
                sender: "System",
                content: `${data.player.pseudo} a quitté la partie.`,
              },
            ]);
            break;

          case "game_message":
            setMessages((prev) => [
              ...prev,
              {
                sender: data.player.pseudo,
                content: data.message,
              },
            ]);
            break;

          case "room_state":
            setPlayers(data.players);
            break;

          case "error":
            console.error("Erreur WebSocket:", data.message);
            if (data.message === "Session invalide") {
              navigate("/");
            }
            break;
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("Erreur WebSocket:", error);
        setIsConnected(false);
        setIsConnecting(false);
      };

      wsRef.current.onclose = (event) => {
        console.log("Déconnecté du WebSocket", event);
        setIsConnected(false);
        setIsConnecting(false);
      };
    }

    // Nettoyage à la déconnexion
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "message",
          message: messageInput,
        })
      );
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
                  <li key={player.id} className="flex items-center">
                    {player.pseudo}
                    {player.is_owner && (
                      <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded">
                        Owner
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
