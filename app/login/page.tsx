'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  useEffect(() => {
    // إذا كان هناك اسم مستخدم مسجل، الانتقال مباشرة للدردشة
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      router.push('/');
    }
  }, []);

  const handleLogin = () => {
    if (username.trim()) {
      localStorage.setItem('username', username.trim());
      router.push('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">تسجيل الدخول</h2>
        <input
          type="text"
          placeholder="أدخل اسم المستخدم"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md"
        >
          دخول
        </button>
      </div>
    </div>
  );
}
