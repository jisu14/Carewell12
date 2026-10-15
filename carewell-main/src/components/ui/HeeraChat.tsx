import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Send, ChevronDown, MessageSquareText, Shield, Sparkles, HelpCircle } from 'lucide-react';
import { heeraService } from '@/services/heeraService';

export function HeeraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'heera'; text: string; }[]>([
    { role: 'heera', text: 'Welcome to CareWell Concierge. I can help you find specialists, organize home nursing, or check upcoming appointments. How may I assist you today?' }
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Find a verified cardiologist",
    "Arrange home care for my father",
    "Summarize recent diagnostic reports",
    "Request prescription medicine refill",
    "When is our next scheduled visit?"
  ];

  const handleProcess = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery('');
    setIsProcessing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const response = await heeraService.process({ query: text });
      
      setMessages(prev => [...prev, { role: 'heera', text: response.text }]);
      
      if (response.action && response.action.type === 'navigate') {
        setTimeout(() => {
          setIsOpen(false);
          navigate(response.action!.payload);
        }, 1200);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'heera', text: 'Our care coordination service is currently synchronizing. Please try again shortly or contact support.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing, isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Luxury Care Concierge Floating Anchor */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-850 hover:to-emerald-950 text-white px-4 py-3 shadow-[0_8px_25px_-4px_rgba(15,23,42,0.3),0_0_15px_-2px_rgba(16,185,129,0.25)] border border-neutral-700/60 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
            aria-label="Open Care Concierge"
          >
            <div className="relative flex items-center justify-center">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="absolute -inset-1 rounded-full bg-emerald-500/20 animate-ping" />
            </div>
            <MessageSquareText size={18} className="text-emerald-300 group-hover:text-emerald-200 transition-colors" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
                Care Concierge
                <Sparkles size={11} className="text-emerald-400" />
              </span>
              <span className="text-[9px] text-emerald-300/80 font-medium leading-none">24/7 AI Assistance</span>
            </div>
          </button>
        )}
      </div>

      {/* Concierge Window */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[84vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl lg:bottom-6 lg:right-6 lg:h-[600px] lg:rounded-3xl lg:mx-0 border border-neutral-200/90 animate-in fade-in slide-in-from-bottom-6 duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 bg-white/90 backdrop-blur-md px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white shadow-sm shadow-emerald-800/20">
                <MessageSquareText size={19} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-neutral-950 tracking-tight font-display">Care Concierge</h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800 border border-emerald-200/60 shadow-2xs">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 font-medium">Verified medical navigation & scheduling</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label="Close"
            >
              <ChevronDown size={19} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-neutral-900 text-white rounded-br-xs shadow-md shadow-neutral-900/10' 
                    : 'bg-white border border-neutral-200/80 text-neutral-800 rounded-bl-xs shadow-subtle'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-xs bg-white border border-neutral-200/80 px-4 py-3 shadow-subtle flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions & Input */}
          <div className="border-t border-neutral-100 bg-white p-4 space-y-3">
            {messages.length === 1 && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">Quick Navigation Suggestions</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleProcess(prompt)}
                      className="rounded-xl border border-neutral-200/80 bg-neutral-50/80 px-3 py-1.5 text-left text-[11px] font-semibold text-neutral-700 transition-all hover:bg-emerald-50 hover:border-emerald-200/80 hover:text-emerald-900 shadow-2xs active:scale-98"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form 
              onSubmit={(e) => { e.preventDefault(); handleProcess(query); }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about specialists, diagnostics, home nursing..."
                className="w-full rounded-2xl border border-neutral-200/90 bg-neutral-50/80 py-2.5 pl-4 pr-11 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!query.trim() || isProcessing}
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-600 text-white transition-opacity disabled:opacity-30 hover:scale-105 active:scale-95 shadow-2xs"
                aria-label="Send message"
              >
                <Send size={13} />
              </button>
            </form>
            <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-neutral-400">
              <Shield size={11} className="text-emerald-600" />
              <span>Coordinated AI navigation. For life-threatening emergencies, dial 112 / 911 immediately.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

