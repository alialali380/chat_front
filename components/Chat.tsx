'use client'; // هذا السطر مهم لأننا نستخدم React hooks وعميل Socket داخل Next.js (app directory)

import React, { useEffect, useState } from 'react';
import { socket } from '../lib/socket'; // استيراد اتصال socket.io الذي أنشأناه في ملف منفصل
import { getClientId } from '../lib/clientId'; // دالة لجلب معرف العميل المميز (UUID)

const clientId = getClientId(); // الحصول على معرف فريد للعميل (يتم تخزينه في localStorage)

interface Message {
  id: string;  // معرف المرسل (Client ID)
  text: string; // نص الرسالة
}

const Chat = () => {
  // حالة لتخزين نص الرسالة الذي يكتبه المستخدم
  const [message, setMessage] = useState('');

  // حالة لتخزين قائمة الرسائل المستلمة والمعروضة
  const [messages, setMessages] = useState<Message[]>([]);

  // useEffect يتم تشغيله عند تحميل المكوّن لأول مرة
  useEffect(() => {
    socket.connect(); // فتح اتصال WebSocket مع الخادم

    // الاستماع لحدث "connect" - تم الاتصال بالخادم
    socket.on('connect', () => {
      console.log('✅ Connected');
    });

    // الاستماع لرسائل جديدة من الخادم
    socket.on('message', (msg: Message) => {
      // إضافة الرسالة الجديدة إلى قائمة الرسائل
      setMessages((prev) => [...prev, msg]);
    });

    // تنظيف عند إغلاق المكوّن (قطع الاتصال)
    return () => {
      socket.disconnect();
    };
  }, []);

  // دالة إرسال الرسالة إلى الخادم
  const sendMessage = () => {
    if (message.trim()) {
      // إرسال الرسالة مع معرف العميل والنص
      socket.emit('message', { id: clientId, text: message });
      setMessage(''); // إعادة تعيين حقل الإدخال إلى فارغ
    }
  };

  return (
    // تصميم الصفحة بالكامل بالـ Tailwind CSS مع خلفية متدرجة ومرنة
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* رأس الدردشة */}
        <header className="bg-indigo-500 text-white text-center py-4 text-xl font-bold">
          غرفة الدردشة
        </header>

        {/* منطقة عرض الرسائل */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50 custom-scrollbar">
          {messages.map((msg, i) => {
            // التحقق إذا كانت الرسالة مرسلة من نفس العميل (لتغيير اللون والمحاذاة)
            const isMine = msg.id === clientId;

            return (
              <div
                key={i}
                className={`px-4 py-2 rounded-xl w-fit max-w-[80%] ${
                  isMine
                    ? 'bg-indigo-500 text-white self-end ml-auto' // رسالة من نفس العميل: بنفسجي ومحاذاة يمين
                    : 'bg-gray-200 text-gray-900 self-start mr-auto' // رسالة من آخرين: رمادي ومحاذاة يسار
                }`}
              >
                {msg.text}
              </div>
            );
          })}
        </div>

        {/* صندوق إدخال الرسائل مع زر الإرسال */}
        <div className="p-4 border-t bg-white flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="اكتب رسالتك..."
            value={message} // قيمة حقل النص مرتبطة بحالة message
            onChange={(e) => setMessage(e.target.value)} // تحديث الحالة عند الكتابة
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()} // إرسال عند الضغط على Enter
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
