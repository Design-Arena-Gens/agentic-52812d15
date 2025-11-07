'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 Main VIKAS AI Assistant hoon, VIKAS CSC – Fastrac Digital Service Provider se. Aapka swagat hai! Aap mujhe apna naam bata sakte hain aur main aapki kaise madad kar sakta hoon?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf kijiye, kuch technical issue aa gaya hai. Kripya thodi der baad phir se try karein. 🙏'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">VIKAS CSC</h1>
              <p className="text-blue-100 text-sm mt-1">Fastrac Digital Service Provider</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">AI Assistant</p>
              <p className="text-xs text-blue-100">Vikas ke sath aapke vikas ki baat</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>

          {/* Messages Area */}
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border border-gray-200 rounded-2xl px-5 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <form onSubmit={handleSubmit} className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Apna sawal yahan likhein..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Services Info */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">हमारी सेवाएं / Our Services:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-semibold text-blue-800">📋 Pension Services</p>
              <p className="text-gray-600 text-xs">DLC, Sparsh, Life Certificate</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-semibold text-green-800">💳 Banking Services</p>
              <p className="text-gray-600 text-xs">Account, Cards, Transfers</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="font-semibold text-purple-800">🆔 ID Services</p>
              <p className="text-gray-600 text-xs">Aadhaar, PAN, Passport</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="font-semibold text-orange-800">🏛️ PM Schemes</p>
              <p className="text-gray-600 text-xs">Samman, Sambhal Card</p>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg">
              <p className="font-semibold text-pink-800">💰 Bill Payment</p>
              <p className="text-gray-600 text-xs">Electricity, Water, Mobile</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="font-semibold text-indigo-800">📱 Recharge</p>
              <p className="text-gray-600 text-xs">Mobile, DTH, Data Card</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
