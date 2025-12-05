
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startChat } from '../services/geminiService';
import { MessageSquare, X, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { Chat, GenerateContentResponse } from '@google/genai';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const initializeChat = useCallback(() => {
    if (!chatRef.current) {
        chatRef.current = startChat();
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
        initializeChat();
    }
  }, [isOpen, initializeChat]);


  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setHistory(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
        const stream = await chatRef.current.sendMessageStream({ message: input });
        let modelResponseText = '';
        
        // Add an empty model message to start updating
        setHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

        for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse;
            modelResponseText += c.text;
            setHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: modelResponseText }]};
                return newHistory;
            });
        }
    } catch (error) {
        console.error("Chat error:", error);
        setHistory(prev => [...prev, { role: 'model', parts: [{ text: "Oops, my brain's a little foggy right now. Try again in a bit?" }]}]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 lg:bottom-8 right-4 lg:right-8 z-50 w-16 h-16 bg-berry-500 rounded-full flex items-center justify-center text-white shadow-berry-soft"
      >
        <AnimatePresence>
        {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-44 lg:bottom-28 right-4 lg:right-8 z-40 w-[calc(100vw-2rem)] sm:w-96 h-[60vh] bg-white/80 backdrop-blur-xl rounded-4xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-4 bg-white/50 border-b border-stone-200">
              <h3 className="font-serif text-xl text-berry-500 text-center">Chat with Sofagirl</h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {history.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-berry-500 text-white rounded-br-none' : 'bg-stone-200 text-stone-800 rounded-bl-none'}`}>
                    <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                  </div>
                </div>
              ))}
               {loading && (
                    <div className="flex justify-start">
                        <div className="bg-stone-200 text-stone-800 rounded-2xl rounded-bl-none px-4 py-2">
                           <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-stone-400 rounded-full animate-pulse delay-75"></span>
                                <span className="w-2 h-2 bg-stone-400 rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-stone-400 rounded-full animate-pulse delay-300"></span>
                           </div>
                        </div>
                    </div>
                )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white/50 border-t border-stone-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 bg-white border-2 border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-berry-500"
                  disabled={loading}
                />
                <button onClick={handleSend} disabled={loading} className="p-3 bg-berry-500 text-white rounded-full disabled:bg-stone-300">
                    <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
