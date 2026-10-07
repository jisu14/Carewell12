import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, X, Send, ChevronDown, MessageSquare } from 'lucide-react';
import { heeraService } from '@/services/heeraService';

export function HeeraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'heera'; text: string; }[]>([
    { role: 'heera', text: 'I am Heera, your care ecosystem assistant. What can I help you with?' }
  ]);
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Find a nurse for my father",
    "Show my father's upcoming care",
    "Summarize my recent reports",
    "Find a cardiologist",
    "Prepare medicines from my prescription",
    "When is my next appointment?"
  ];

  const handleProcess = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery('');
    setIsProcessing(true);

    try {
      // Mocking network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await heeraService.process({ query: text });
      
      setMessages(prev => [...prev, { role: 'heera', text: response.text }]);
      
      if (response.action && response.action.type === 'navigate') {
        setTimeout(() => {
          setIsOpen(false);
          navigate(response.action!.payload);
        }, 1500);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'heera', text: 'Sorry, I encountered an error processing your request.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing, isOpen]);

  // Close chat when location changes manually
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Floating Entry Point */}
      <div className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex h-14 items-center justify-center gap-2 rounded-full bg-primary-600 px-5 text-white shadow-lg shadow-primary-600/30 transition-transform hover:scale-105 active:scale-95"
            aria-label="Ask Heera"
          >
            <Sparkles size={20} className="group-hover:animate-pulse" />
            <span className="font-bold">Ask Heera</span>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl lg:bottom-4 lg:right-4 lg:h-[600px] lg:rounded-3xl lg:mx-0">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-800">Heera AI</h3>
                <p className="text-xs text-neutral-500">Assistant & Navigator</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-neutral-100 text-neutral-700 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white border border-neutral-100 px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions & Input */}
          <div className="border-t border-neutral-100 bg-white p-4">
            
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">Suggested</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleProcess(prompt)}
                      className="rounded-xl border border-primary-100 bg-primary-50 px-3 py-2 text-left text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
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
                placeholder="Ask Heera anything..."
                className="w-full rounded-2xl border-none bg-neutral-100 py-3 pl-4 pr-12 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={!query.trim() || isProcessing}
                className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-primary-600 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send size={14} />
              </button>
            </form>
            <p className="mt-3 text-center text-[10px] text-neutral-400">
              Heera is an AI assistant and cannot make autonomous clinical decisions or prescribe medicines.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
