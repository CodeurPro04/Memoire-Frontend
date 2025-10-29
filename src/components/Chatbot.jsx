import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/api/axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const initialMessage = {
    id: Date.now(),
    text: "Salut ! Je suis MeetMed AI, votre assistant médical intelligent. Décrivez vos symptômes et je vous orienterai vers le spécialiste idéal.",
    sender: "bot",
  };

  const predefinedMessages = [
    "🌡️ Fièvre",
    "😷 Toux persistante",
    "🤕 Mal de ventre",
    "🦴 Douleurs articulaires",
    "😴 Fatigue intense",
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) setMessages([initialMessage]);
  }, [isOpen]);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (customMessage) => {
    const messageToSend = customMessage || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage = { id: Date.now(), text: messageToSend, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await api.post("/chat/diagnose", { message: messageToSend });
      const data = res.data;

      if (data.specialite) {
        const reply = `💡 ${data.raison}\n\nSpécialité recommandée : ${data.specialite}`;

        // Cards médecins avec design futuriste
        const medecinsComponents = data.medecins?.map((m) => (
          <a
            key={m.id}
            href={`/profil-medecin/${m.id}`}
            rel="noopener noreferrer"
            className="group relative flex items-center gap-4 p-4 bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 hover:scale-[1.02] overflow-hidden"
          >
            {/* Effet de brillance au survol */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12" />

            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5">
                <img
                  src={m.photo_profil || "/medécin/default-avatar.png"}
                  alt={`Dr ${m.prenom} ${m.nom}`}
                  className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>

            <div className="flex-1">
              <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                Dr {m.prenom} {m.nom}
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h4>
              <p className="text-xs text-cyan-300 mb-2">{m.specialite}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                  <span className="text-yellow-400 text-xs">⭐</span>
                  <span className="text-yellow-200 text-xs font-semibold">
                    {m.note || "Non noté"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Disponible</span>
              </div>
            </div>

            <Zap className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ));

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: reply,
            sender: "bot",
            medecins: medecinsComponents,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text:
              data.message ||
              "Je n'ai pas compris vos symptômes, pouvez-vous reformuler ?",
            sender: "bot",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Une erreur est survenue. Veuillez réessayer plus tard.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2); }
          50% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .glow-button {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        
        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.2), transparent);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite;
        }
        
        .glassmorphism {
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Bouton flottant avec Framer Motion et effet futuriste */}
      <motion.div
        className="fixed bottom-6 right-6 z-[100]"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="relative float-animation">
          {/* Cercles d'ondes */}
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-400/10"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />

          <Button
            onClick={() => setIsOpen(!isOpen)}
            size="icon"
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white shadow-lg transition-all duration-300 hover:scale-110 glow-button"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={28} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageSquare size={28} />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.div>

      {/* Fenêtre de chat avec AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed bottom-24 right-6 w-full max-w-md h-[75vh] z-[99]"
          >
            <div className="relative h-full glassmorphism rounded-3xl shadow-2xl border border-cyan-500/30 flex flex-col overflow-hidden">
              {/* Effet de grille futuriste en arrière-plan */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
              </div>

              {/* Header avec dégradé animé */}
              <header className="relative p-5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 flex items-center justify-between overflow-hidden rounded-t-3xl">
                <div className="absolute inset-0 shimmer-bg" />
                <div className="relative flex items-center space-x-3 z-10">
                  <div className="relative">
                    <Bot className="w-8 h-8 text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      MeetMed AI
                      <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                    </h3>
                    <p className="text-xs text-cyan-100">
                      Assistant Médical Intelligent
                    </p>
                  </div>
                </div>
                <div className="relative z-10 flex gap-1">
                  {[0, 0.2, 0.4].map((delay, idx) => (
                    <motion.div
                      key={idx}
                      className="w-2 h-2 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay }}
                    />
                  ))}
                </div>
              </header>

              {/* Messages avec scroll et animations */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto scrollbar-hide">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${
                        msg.sender === "bot" ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-4 rounded-2xl shadow-xl text-sm backdrop-blur-sm ${
                          msg.sender === "bot"
                            ? "bg-gradient-to-br from-slate-800/90 to-slate-900/90 text-white border border-cyan-500/30 rounded-tl-none"
                            : "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-tr-none"
                        }`}
                      >
                        {msg.sender === "bot" && (
                          <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-semibold">
                            <Sparkles className="w-3 h-3" />
                            <span>MeetMed AI</span>
                          </div>
                        )}
                        <div className="whitespace-pre-line leading-relaxed">
                          {msg.text}
                        </div>
                        {msg.medecins && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-4 space-y-3"
                          >
                            {msg.medecins}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-3 p-4 bg-slate-800/90 border border-cyan-500/30 rounded-2xl rounded-tl-none backdrop-blur-sm">
                      <div className="flex gap-1">
                        {[0, 0.2, 0.4].map((delay, idx) => (
                          <motion.div
                            key={idx}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                            animate={{ y: [0, -10, 0] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay,
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-cyan-300 text-sm">
                        Analyse en cours...
                      </span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Footer moderne */}
              <footer className="relative p-5 bg-slate-900/50 border-t border-cyan-500/20 backdrop-blur-xl">
                {/* Messages prédéfinis */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {predefinedMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendMessage(msg)}
                        className="px-3 py-1.5 text-xs font-medium bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 rounded-full transition-all duration-300"
                      >
                        {msg}
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Input avec effet néon */}
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Décrivez vos symptômes..."
                    className="flex-1 px-4 py-3 bg-slate-800/80 border border-cyan-500/30 focus:border-cyan-400/60 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => handleSendMessage()}
                      size="icon"
                      disabled={loading}
                      className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                      style={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)" }}
                    >
                      <Send size={20} />
                    </Button>
                  </motion.div>
                </div>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
