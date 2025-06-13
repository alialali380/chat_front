"use client";

import React, { useEffect, useState } from "react";
import { socket } from "../lib/socket";
import { getClientId } from "../lib/clientId";

const clientId = getClientId();

interface Message {
  id: string;
  text: string;
  username: string;
  timestamp?: string;
}

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      window.location.href = "/login";
      return;
    }

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected");
    });

    // ✅ استخدم دالة مستقلة حتى نستطيع حذفها لاحقًا
    const handleMessage = (msg: Message) => {
      console.log("📩 Received:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("message", handleMessage);

    // ✅ إزالة المستمع عند الخروج من المكون
    return () => {
      socket.off("message", handleMessage); // 💡 مهم جدًا لتفادي التكرار
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const username = localStorage.getItem("username") || "مجهول";
      socket.emit("message", {
        id: clientId,
        text: message,
        username,
        timestamp: new Date().toISOString(),
      });
      setMessage("");
    }
  };

  const formatTime = (timestamp: string) =>
    new Intl.DateTimeFormat("ar-EG", {
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(timestamp));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[80vh]">
        <header className="bg-indigo-500 text-white text-center py-4 text-xl font-bold">
          غرفة الدردشة
        </header>

        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50 custom-scrollbar">
          {messages.map((msg, i) => {
            const isMine = msg.id === clientId;

            return (
              <div
                key={i}
                className={`flex flex-col max-w-[80%] rounded-2xl px-4 py-3 shadow-md mb-2 ${
                  isMine
                    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white self-end ml-auto"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 self-start mr-auto"
                }`}
              >
                {/* اسم المستخدم */}
                <span
                  className={`text-sm font-bold mb-1 ${
                    isMine
                      ? "text-cyan-200" // لون اسم المستخدم عندي مختلف كلياً عن خلفية الرسالة (مثلاً سماوي فاتح)
                      : "text-indigo-700" // لون اسم المستخدم عند الآخرين (أزرق غامق)
                  }`}
                >
                  {msg.username}
                </span>

                {/* نص الرسالة */}
                <p className="text-base leading-relaxed break-words whitespace-pre-wrap">
                  {msg.text}
                </p>

                {/* التوقيت */}
                {msg.timestamp && (
                  <span
                    className={`text-xs mt-2 ${
                      isMine ? "text-indigo-200" : "text-gray-500"
                    } self-end`}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t bg-white flex gap-2 ">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="اكتب رسالتك..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 💡 لمنع تكرار الإرسال
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2 rounded-xl"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
