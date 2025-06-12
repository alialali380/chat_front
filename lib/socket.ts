// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const URL = 'http://192.168.1.108:3000'; // عنوان خادم NestJS

export const socket: Socket = io(URL, {
  autoConnect: false,
});
