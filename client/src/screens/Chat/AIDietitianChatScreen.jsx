import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGame } from '../../context/GameContext.jsx';
import userService from '../../services/userService.js';
import {
  Send,
  Sparkles,
  Utensils,
  Bot,
  User,
  Heart,
  Flame,
  Info,
  RefreshCw,
  Lightbulb
} from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "🇪🇬 What is an authentic healthy Egyptian dinner under 500 kcal?",
  "🥣 Suggest a high-protein post-workout snack with oats",
  "🍽️ What can I order at a Lebanese or Mediterranean restaurant under 550 kcal?",
  "💧 Any tips to easily hit my 4.0L Overachiever water target?",
  "🍕 Give me a healthy high-protein alternative to pizza"
];

export const AIDietitianChatScreen = () => {
  const { user } = useAuth();
  const { stats } = useGame();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hello ${user?.name || 'Adventurer'}! I'm Dr. Alexandria, your personal RPG AI Nutritionist & Dietitian Coach.\n\nI have your active target of **${user?.metrics?.caloric_target || 1850} kcal** and your **${user?.diet_type || 'Balanced'}** preference ready. Ask me anything about meal ideas, restaurant swaps, Egyptian & international cuisines, or hitting your macro goals!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageToSend) => {
    const text = (messageToSend || input).trim();
    if (!text || isLoading) return;

    setInput('');

    const userMsg = {
      id: `user_${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await userService.sendDietitianChat(text, historyPayload);

      const botReply = res?.reply || "I analyzed your dietary metrics and recommend keeping protein high with nutrient-dense lean choices. Let me know if you'd like a specific recipe!";

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          role: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('[AIDietitianChatScreen] Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          text: "I apologize, my communication link with the culinary council wavered momentarily. Please ensure your query is sent again, and I'll generate your personalized guidance!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[580px] animate-in fade-in select-none">
      {/* Header Info Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3.5 shadow-sm mb-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B7CFF] to-[#7C3AED] flex items-center justify-center text-white shadow-sm shadow-[#8B7CFF]/30">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-xs text-slate-900 font-bold">DR. ALEXANDRIA (AI DIETITIAN)</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-sans-app font-semibold bg-emerald-100 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans-app">
              Grounded in your {user?.metrics?.caloric_target || 1850} kcal budget & personal food profile
            </p>
          </div>
        </div>

        {/* User Context Chips */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono-app">
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-bold">
            🔥 {user?.metrics?.caloric_target || 1850} kcal
          </span>
          <span className="px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-lg text-purple-800 font-bold">
            🥗 {user?.diet_type || 'Balanced'}
          </span>
          <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 font-bold">
            💧 {stats?.water_target_ml || 3000} mL
          </span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none shrink-0 mb-2">
        <span className="text-[10px] font-pixel text-slate-400 flex items-center gap-1 whitespace-nowrap pl-1">
          <Lightbulb size={12} className="text-amber-500" /> QUICK PROMPTS:
        </span>
        {SUGGESTED_PROMPTS.map((promptText, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(promptText)}
            className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-sans-app text-slate-700 whitespace-nowrap transition-all cursor-pointer shadow-2xs hover:border-[#8B7CFF]/50"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 bg-white border border-[#E2E8F0] rounded-3xl p-4 sm:p-5 overflow-y-auto shadow-sm space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-[#8B7CFF] text-white shadow-xs'
                    : 'bg-gradient-to-tr from-purple-100 to-indigo-100 text-[#7C3AED] border border-purple-200'
                }`}
              >
                {isUser ? <User size={15} /> : <Bot size={16} />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs font-sans-app leading-relaxed shadow-2xs ${
                  isUser
                    ? 'bg-[#8B7CFF] text-white rounded-tr-none'
                    : 'bg-[#F8FAFC] border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.text}
                <div
                  className={`mt-1.5 text-[9px] font-mono-app ${
                    isUser ? 'text-purple-200 text-right' : 'text-slate-400 text-left'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7C3AED] border border-purple-200 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-2xs flex items-center gap-2 text-xs text-slate-500 font-sans-app">
              <span className="w-2 h-2 rounded-full bg-[#8B7CFF] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#8B7CFF] animate-bounce delay-100" />
              <span className="w-2 h-2 rounded-full bg-[#8B7CFF] animate-bounce delay-200" />
              <span className="ml-1 text-[11px] font-mono-app">Dr. Alexandria is calculating recipe nutrition...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="mt-3 flex items-center gap-2 shrink-0">
        <div className="flex-1 bg-white border border-[#E2E8F0] focus-within:border-[#8B7CFF] focus-within:ring-2 focus-within:ring-[#8B7CFF]/15 rounded-2xl px-4 py-2.5 shadow-sm transition-all flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dr. Alexandria (e.g., 'What can I eat at an Egyptian cafe for lunch?')"
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none font-sans-app"
          />
        </div>

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="h-11 px-5 rounded-2xl bg-[#8B7CFF] hover:bg-[#7C3AED] disabled:opacity-50 disabled:cursor-not-allowed text-white font-pixel text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#8B7CFF]/25 cursor-pointer shrink-0"
        >
          <span>SEND</span>
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default AIDietitianChatScreen;
