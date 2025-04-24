import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;

export const createRoom = async (pseudo: string) => {
  const response = await apiClient.post("game/create-room/", { pseudo });
  return response.data;
};

export const joinRoom = async (roomCode: string, pseudo: string) => {
  const response = await apiClient.post("game/join-room/", {
    room_code: roomCode,
    pseudo,
  });
  return response.data;
};
