import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function LobbyPage() {
  const { roomCode } = useParams();
  const [messages, setMessages] = useState<string[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/game/${roomCode}/`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "welcome":
          setMessages((prevMessages) => [...prevMessages, data.message]);
          break;

        case "game_message":
          setMessages((prevMessages) => [
            ...prevMessages,
            `${data.player.pseudo}: ${data.message}`,
          ]);
          break;

        case "player_joined":
          console.log("Player joined:", data);
          setPlayers((prevPlayers) => [...prevPlayers, data.player.pseudo]);
          setMessages((prevMessages) => [
            ...prevMessages,
            `${data.player.pseudo} has joined the room.`,
          ]);
          break;

        case "player_left":
          setPlayers((prevPlayers) =>
            prevPlayers.filter((player) => player !== data.player.pseudo)
          );
          setMessages((prevMessages) => [
            ...prevMessages,
            `${data.player.pseudo} has left the room.`,
          ]);
          break;

        default:
          console.warn("Unhandled message type:", data.type);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.log("Disconnected from WebSocket", event);
    };

    // Cleanup function on component unmount
    return () => {
      ws.close();
    };
  }, [roomCode]);

  const handleSendMessage = () => {
    if (messageInput.trim() && socket) {
      socket.send(JSON.stringify({ message: messageInput }));
      setMessageInput("");
    }
  };

  return (
    <div className="room-container p-4">
      <h1 className="text-2xl font-bold mb-4">Room: {roomCode}</h1>

      <div className="players-list mb-4">
        <h2 className="text-xl font-semibold">Players:</h2>
        <ul>
          {players.length === 0 ? (
            <li>No players connected.</li>
          ) : (
            players.map((player, index) => <li key={index}>{player}</li>)
          )}
        </ul>
      </div>

      <div className="chat-box">
        <h2 className="text-xl font-semibold">Chat:</h2>
        <div className="messages mb-2">
          {messages.map((message, index) => (
            <div key={index} className="message">
              {message}
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 border rounded mb-2"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
