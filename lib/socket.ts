// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:3000'; // استخدم المتغير بدون :3000

export const socket: Socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
});