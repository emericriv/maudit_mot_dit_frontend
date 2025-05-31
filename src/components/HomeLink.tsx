import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../contexts/WebSocketContext";

export function HomeLink() {
  const navigate = useNavigate();
  const { sendMessage, socket } = useWebSocket();

  const handleLeave = () => {
    sendMessage({ type: "leave_room" });
    sessionStorage.clear(); // ou retire juste sessionId/roomCode si besoin
    socket?.close();
    navigate("/");
  };

  return (
    <button
      onClick={handleLeave}
      className="absolute top-6 left-6 text-primary hover:underline text-sm flex items-center bg-transparent border-none p-0"
      style={{ cursor: "pointer" }}
    >
      ← Retour à l'accueil
      <img
        src="/Maudit_mot_dit_logo.png"
        alt="Logo Maudit Mot Dit"
        className="w-10 h-10 ml-1"
      />
    </button>
  );
}
