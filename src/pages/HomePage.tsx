import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Maudit Mot Dit</h1>
      <div className="space-y-4 w-64">
        <button
          onClick={() => navigate("/create")}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-lg font-semibold"
        >
          Create a Room
        </button>
        <button
          onClick={() => navigate("/join")}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-lg font-semibold"
        >
          Join a Room
        </button>
      </div>
    </div>
  );
}
