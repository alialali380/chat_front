// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const URL = `http://${process.env.NEXT_PUBLIC_CHAT_API_URL}:3000`; // عنوان خادم NestJS
// إنشاء اتصال مع سيرفر WebSocket 
export const socket: Socket = io(URL, {
  autoConnect: false, // لن يتم الاتصال تلقائيًا بل عند طلب connect()
});
