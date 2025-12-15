import { useState, useRef, useEffect } from 'react';
import { Persona, ChatMessage } from '@/types/persona';
import { ArrowLeft, Send, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ChatInterfaceProps {
  persona: Persona;
  onBack: () => void;
}

const colorStyles = {
  nikhil: {
    gradient: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    ring: 'ring-cyan-500/50',
  },
  kiran: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    ring: 'ring-purple-500/50',
  },
  sima: {
    gradient: 'from-rose-500 to-orange-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
    ring: 'ring-rose-500/50',
  },
};

export function ChatInterface({ persona, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const styles = colorStyles[persona.color];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://40.90.232.96:8081/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          persona: persona.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate voice response');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: `Voice response from ${persona.name}`,
        isUser: false,
        audioUrl,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Auto-play the audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setPlayingId(aiMessage.id);
      audio.play();
      audio.onended = () => setPlayingId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (audioUrl: string, messageId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setPlayingId(messageId);

    audio.play();
    audio.onended = () => {
      setPlayingId(null);
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col animate-slide-up">
      {/* Ambient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} opacity-30 pointer-events-none`} />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-primary/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className={`glass-card border-b ${styles.border} px-4 py-4 relative z-10 ${styles.glow}`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-secondary/80 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className={`relative w-14 h-14 rounded-full bg-gradient-to-r ${styles.gradient} p-0.5 ${styles.glow}`}>
            <img 
              src={persona.avatar} 
              alt={persona.name}
              className="w-full h-full rounded-full object-cover"
            />
            <div className={`absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background`} />
          </div>

          <div className="flex-1">
            <h2 className={`font-display font-bold text-lg bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent`}>
              {persona.name}
            </h2>
            <p className="text-sm text-muted-foreground">{persona.title}</p>
          </div>

          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full ${styles.bg} ${styles.border} border`}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-r ${styles.gradient} p-1 mb-6 ${styles.glow} animate-float`}>
                <img 
                  src={persona.avatar} 
                  alt={persona.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className={`text-2xl font-display font-bold bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent mb-3`}>
                Start a conversation with {persona.name}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Type your question below and receive a personalized voice response.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                {persona.expertise.map((exp) => (
                  <span 
                    key={exp} 
                    className={`px-3 py-1 rounded-full text-xs ${styles.bg} ${styles.border} border ${styles.text}`}
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {/* Persona Avatar for AI messages */}
              {!message.isUser && (
                <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${styles.gradient} p-0.5 ${styles.glow}`}>
                  <img 
                    src={persona.avatar} 
                    alt={persona.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[70%] rounded-2xl px-5 py-4 ${
                  message.isUser
                    ? `bg-gradient-to-r ${styles.gradient} text-white shadow-lg`
                    : `glass-card ${styles.border} border ${styles.glow}`
                }`}
              >
                {!message.isUser && (
                  <p className={`text-xs font-medium ${styles.text} mb-1`}>{persona.name}</p>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>

                {message.audioUrl && (
                  <button
                    onClick={() => playAudio(message.audioUrl!, message.id)}
                    className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${styles.gradient} text-white hover:opacity-90 transition-all duration-300 shadow-lg`}
                  >
                    <Volume2 className={`w-4 h-4 ${playingId === message.id ? 'animate-pulse' : ''}`} />
                    <span className="text-xs font-semibold">
                      {playingId === message.id ? 'Playing...' : 'Replay Voice'}
                    </span>
                  </button>
                )}
              </div>

              {/* User Avatar for user messages */}
              {message.isUser && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">You</span>
                </div>
              )}
            </div>
          ))}

          {/* Loading State with Blinking Avatar */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${styles.gradient} p-0.5 animate-pulse ${styles.glow}`}>
                <img 
                  src={persona.avatar} 
                  alt={persona.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className={`glass-card ${styles.border} border rounded-2xl px-5 py-4 ${styles.glow}`}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${styles.gradient} animate-bounce`} style={{ animationDelay: '0ms' }} />
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${styles.gradient} animate-bounce`} style={{ animationDelay: '150ms' }} />
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${styles.gradient} animate-bounce`} style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className={`text-sm ${styles.text} font-medium`}>
                    
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`glass-card border-t ${styles.border} px-4 py-5 relative z-10 ${styles.glow}`}>
        <div className="max-w-4xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${persona.name} anything...`}
              className={`w-full bg-secondary/50 border-border focus:ring-2 ${styles.ring} focus:border-transparent py-6 px-5 rounded-xl text-base`}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            size="lg"
            className={`bg-gradient-to-r ${styles.gradient} hover:opacity-90 transition-all duration-300 px-6 rounded-xl ${styles.glow} hover:scale-105`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
