import { Routes, Route, useParams } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateRoomPage from "./pages/CreateRoomPage";
import JoinRoomPage from "./pages/JoinRoomPage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import { WebSocketProvider } from "./contexts/WebSocketContext";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/join" element={<JoinRoomPage />} />
      <Route
        path="/lobby/:roomCode"
        element={
          <RouteWithWebSocket>
            <LobbyPage />
          </RouteWithWebSocket>
        }
      />
      <Route
        path="/game/:roomCode"
        element={
          <RouteWithWebSocket>
            <GamePage />
          </RouteWithWebSocket>
        }
      />
    </Routes>
  );
}

function RouteWithWebSocket({ children }: { children: React.ReactNode }) {
  const { roomCode } = useParams();
  return <WebSocketProvider roomCode={roomCode!}>{children}</WebSocketProvider>;
}
