'use client';

import React, { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { getClientId } from '../lib/clientId';

const clientId = getClientId();

interface Message {
  id: string; // sender ID
  text: string;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected');
    });

    socket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { id: clientId, text: message });
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
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
                className={`px-4 py-2 rounded-xl w-fit max-w-[80%] ${
                  isMine
                    ? 'bg-indigo-500 text-white self-end ml-auto'
                    : 'bg-gray-200 text-gray-900 self-start mr-auto'
                }`}
              >
                {msg.text}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t bg-white flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="اكتب رسالتك..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
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
