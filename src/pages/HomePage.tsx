import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Nettoyer le sessionStorage lors de l'arrivée sur la home
    sessionStorage.clear();

    return () => {
      // Cleanup si nécessaire
    };
  }, []);

  const handleCreateRoom = () => {
    navigate("/create");
  };

  const handleJoinRoom = () => {
    navigate("/join");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Maudit Mot Dit</h1>
      <div className="space-y-4 w-64">
        <button
          onClick={handleCreateRoom}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-lg font-semibold"
        >
          Créer une Room
        </button>
        <button
          onClick={handleJoinRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-lg font-semibold"
        >
          Rejoindre une Room
        </button>
      </div>
    </div>
  );
}
