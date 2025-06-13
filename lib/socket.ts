// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const URL = `https://chat-back-ms9k.onrender.com`;

export const socket: Socket = io(URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
});