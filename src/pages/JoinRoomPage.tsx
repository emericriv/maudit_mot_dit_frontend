import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { joinRoom } from "../services/apiServices";

export default function JoinRoomPage() {
  const [pseudo, setPseudo] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await joinRoom(pseudo, roomCode);
      sessionStorage.setItem("sessionId", response.sessionId);
      sessionStorage.setItem("playerId", response.playerId.toString());
      sessionStorage.setItem("pseudo", response.pseudo);

      navigate(`/lobby/${response.roomCode}`);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Une erreur est survenue.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center px-4">
      {/* Lien de retour */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-primary hover:underline text-sm flex items-center"
      >
        ← Retour à l'accueil
        <img
          src="/Maudit_mot_dit_logo.png"
          alt="Logo Maudit Mot Dit"
          className="w-10 h-10 ml-1"
        />
      </Link>

      {/* Bloc central */}
      <div className="bg-secondary text-background p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Rejoindre une partie
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="roomCode" className="block mb-1 font-semibold">
              Code du salon
            </label>
            <input
              id="roomCode"
              type="text"
              placeholder="ABCDEF"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 rounded-full border border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
              required
            />
          </div>

          <div>
            <label htmlFor="pseudo" className="block mb-1 font-semibold">
              Votre pseudo
            </label>
            <input
              id="pseudo"
              type="text"
              placeholder="Votre pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
              required
            />
          </div>

          {error && <p className="text-red-500 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-background font-bold px-6 py-3 rounded-full hover:bg-accent hover:cursor-pointer transition-all"
          >
            Rejoindre
          </button>
        </form>
      </div>
    </div>
  );
}
