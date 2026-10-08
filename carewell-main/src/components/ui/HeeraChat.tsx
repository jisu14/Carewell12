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
      {/* Discreet Care Concierge Anchor */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 shadow-lg shadow-neutral-900/15 border border-neutral-700/40 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            aria-label="Open Care Concierge"
          >
            <div className="relative flex items-center justify-center">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <MessageSquareText size={17} className="text-neutral-300 group-hover:text-white transition-colors" />
            <span className="text-xs font-semibold tracking-tight">Care Concierge</span>
          </button>
        )}
      </div>

      {/* Concierge Window */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[82vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl lg:bottom-6 lg:right-6 lg:h-[580px] lg:rounded-2xl lg:mx-0 border border-neutral-200/80 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 bg-white px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-800 border border-primary-200/50">
                <MessageSquareText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-neutral-900 tracking-tight">Care Concierge</h3>
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 border border-emerald-200/60">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">Care navigation & appointment support</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              aria-label="Close"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50/40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-neutral-900 text-white rounded-br-xs shadow-xs' 
                    : 'bg-white border border-neutral-200/70 text-neutral-800 rounded-bl-xs shadow-subtle'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-xs bg-white border border-neutral-200/70 px-4 py-3 shadow-subtle flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions & Input */}
          <div className="border-t border-neutral-100 bg-white p-3.5 space-y-3">
            {messages.length === 1 && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">Common Requests</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleProcess(prompt)}
                      className="rounded-lg border border-neutral-200/80 bg-neutral-50 px-2.5 py-1.5 text-left text-[11px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
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
                placeholder="Ask about care plans, doctors, tests..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-2.5 pl-3.5 pr-11 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-600/30 focus:border-primary-600 transition-all"
              />
              <button
                type="submit"
                disabled={!query.trim() || isProcessing}
                className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white transition-opacity disabled:opacity-30 hover:bg-neutral-800"
              >
                <Send size={13} />
              </button>
            </form>
            <div className="flex items-center justify-center gap-1.5 text-center text-[10px] text-neutral-400">
              <Shield size={11} className="text-neutral-400" />
              <span>Automated navigation assistance. In medical emergencies, dial 911 / 112.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
