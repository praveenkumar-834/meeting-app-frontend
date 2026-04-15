import { io } from "socket.io-client";

const socket = io("https://meeting-app-backend-beta.vercel.app:5000");
export default socket;
