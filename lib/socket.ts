// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const URL = 'http://192.168.1.108:3000'; // عنوان خادم NestJS
// إنشاء اتصال مع سيرفر WebSocket 
export const socket: Socket = io(URL, {
  autoConnect: false, // لن يتم الاتصال تلقائيًا بل عند طلب connect()
});
