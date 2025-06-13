import { io, Socket } from 'socket.io-client';

const URL = `https://chat-back-ms9k.onrender.com`;
// const URL = `http://192.168.1.108:3000`;

// إنشاء اتصال مع الخادم
export const socket: Socket = io(URL, {
  autoConnect: false, // لا يتم الاتصال تلقائيًا بمجرد إنشاء الكائن، يجب استدعاء.connect() لاحقًا.
  reconnection: true, // اذا انقطع الاتصال يحاول الاتصال مرة اخرى بشكل تلقائي
  reconnectionAttempts: Infinity, // عدد محاولات إعادة الاتصال غير محدود.
});