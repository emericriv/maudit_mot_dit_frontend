import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  sendMessage: (message: any) => void;
  currentPlayerId: string;
  players: Player[];
  roomCode: string;
  addMessageHandler: (handler: (data: any) => void) => void;
  removeMessageHandler: (handler: (data: any) => void) => void;
}

interface Player {
  id: string;
  pseudo: string;
  is_owner: boolean;
  score?: number;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export function WebSocketProvider({
  children,
  roomCode,
}: {
  children: React.ReactNode;
  roomCode: string;
}) {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [currentPlayerId, setCurrentPlayerId] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      console.error("Session ID manquant");
      navigate("/");
      return;
    }

    if (!wsRef.current) {
      wsRef.current = new WebSocket(
        `${import.meta.env.VITE_WS_URL}/game/${roomCode}/`
      );
      setSocket(wsRef.current);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        wsRef.current?.send(
          JSON.stringify({
            type: "init",
            sessionId: sessionId,
          })
        );
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      wsRef.current.onerror = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [roomCode]);

  const messageHandlers = useRef<((data: any) => void)[]>([]);

  const addMessageHandler = (handler: (data: any) => void) => {
    messageHandlers.current.push(handler);
  };

  const removeMessageHandler = (handler: (data: any) => void) => {
    messageHandlers.current = messageHandlers.current.filter(
      (h) => h !== handler
    );
  };

  const handleWebSocketMessage = (data: any) => {
    messageHandlers.current.forEach((handler) => handler(data));

    switch (data.type) {
      case "welcome":
        setCurrentPlayerId(data.playerId);
        break;
      case "room_state":
        setPlayers(data.players);
        break;
      case "player_joined":
        setPlayers((prev) => {
          const playerExists = prev.some((p) => p.id === data.player.id);
          if (playerExists) return prev;
          return [...prev, data.player];
        });
        break;
      case "player_left":
        setPlayers((prev) => prev.filter((p) => p.id !== data.player.id));
        break;
      case "owner_changed":
        setPlayers((prev) =>
          prev.map((player) => ({
            ...player,
            is_owner: player.id === data.player.id,
          }))
        );
        break;
      case "start_new_round":
      case "round_complete":
        if (data.players) {
          setPlayers(data.players);
        }
        break;
    }
  };

  const sendMessage = (message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        isConnecting,
        sendMessage,
        currentPlayerId,
        players,
        roomCode,
        addMessageHandler,
        removeMessageHandler,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
