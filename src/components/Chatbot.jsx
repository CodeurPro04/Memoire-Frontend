import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Chatbot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const initialMessage = {
    id: Date.now(),
    text: t('chatbot.welcome'),
    sender: 'bot',
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialMessage]);
    } else if (isOpen && messages.length > 0 && messages[0].text !== t('chatbot.welcome')) {
      // Update welcome message if language changed while closed
      setMessages([initialMessage, ...messages.slice(1)]);
    }
  }, [isOpen, t, i18n.language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');

    setTimeout(() => {
      let botResponseText = t('chatbot.defaultResponse');
      const lowerInput = inputValue.toLowerCase();

      if (lowerInput.includes(t('chatbot.keywords.hello').toLowerCase()) || lowerInput.includes(t('chatbot.keywords.hi').toLowerCase())) {
        botResponseText = t('chatbot.responses.greeting');
      } else if (lowerInput.includes(t('chatbot.keywords.services').toLowerCase())) {
        botResponseText = t('chatbot.responses.servicesInfo');
      } else if (lowerInput.includes(t('chatbot.keywords.contact').toLowerCase())) {
        botResponseText = t('chatbot.responses.contactInfo');
      } else if (lowerInput.includes(t('chatbot.keywords.quote').toLowerCase()) || lowerInput.includes(t('chatbot.keywords.price').toLowerCase())) {
         botResponseText = t('chatbot.responses.quoteInfo');
      } else if (lowerInput.includes(t('chatbot.keywords.thankyou').toLowerCase())) {
        botResponseText = t('chatbot.responses.thankyouReply');
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-[100]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 120 }}
      >
        <Button
          onClick={toggleChatbot}
          size="icon"
          className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:bg-black/90 text-kofgo-white shadow-2xl transform hover:scale-110 transition-all duration-300"
          aria-label={isOpen ? t('chatbot.closeAria') : t('chatbot.openAria')}
        >
          {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-24 right-6 w-full max-w-sm h-[70vh] max-h-[500px] bg-kofgo-white/90 dark:bg-kofgo-gray-dark/90 backdrop-blur-lg rounded-xl shadow-2xl flex flex-col overflow-hidden border border-kofgo-gray-light dark:border-kofgo-gray z-[99]"
          >
            <header className="p-4 bg-kofgo-gray-light/50 dark:bg-kofgo-gray/50 border-b border-kofgo-gray-light dark:border-kofgo-gray flex items-center space-x-3">
              <Bot className="w-7 h-7 text-green-700 dark:text-kofgo-gold" />
              <h3 className="text-lg font-semibold text-green-700 dark:text-kofgo-white">{t('chatbot.header')}</h3>
            </header>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[75%] p-3 rounded-lg shadow ${
                      msg.sender === 'bot'
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-kofgo-black rounded-br-none dark:bg-kofgo-blue/70'
                        : 'bg-black/80 text-kofgo-white rounded-bl-none dark:bg-kofgo-gold/70 dark:text-kofgo-black'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 border-t border-kofgo-gray-light dark:border-kofgo-gray bg-kofgo-gray-light/50 dark:bg-kofgo-gray/50">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={t('chatbot.inputPlaceholder')}
                  className="flex-1 px-4 py-2.5 bg-kofgo-white dark:bg-kofgo-gray border border-kofgo-gray-light dark:border-kofgo-gray-medium rounded-lg text-kofgo-gray-dark dark:text-kofgo-white placeholder-kofgo-gray-medium dark:placeholder-kofgo-gray-light/70 focus:ring-2 focus:ring-green-700 dark:focus:ring-green-700 focus:border-transparent transition-all duration-300"
                />
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  className="w-10 h-10 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 hover:bg-black/90 text-kofgo-white rounded-lg"
                  aria-label={t('chatbot.sendAria')}
                >
                  <Send size={20} />
                </Button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;