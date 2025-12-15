import { useState, useRef, useEffect } from 'react';
import { Persona, ChatMessage } from '@/types/persona';
import { ArrowLeft, Send, Volume2, Loader2, Mic } from 'lucide-react';
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
  },
  kiran: {
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
  },
  sima: {
    gradient: 'from-rose-500 to-orange-500',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
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
      const response = await fetch('http://40.90.232.96:8080/generate-voice', {
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
      {/* Header */}
      <div className={`glass-card border-b ${styles.border} px-4 py-4`}>
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${styles.gradient} p-0.5`}>
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <span className={`text-lg font-display font-bold bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent`}>
                {persona.name[0]}
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-foreground">{persona.name}</h2>
            <p className="text-sm text-muted-foreground">{persona.title}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${styles.gradient} p-1 mb-6`}>
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                  <Mic className={`w-8 h-8 ${styles.text}`} />
                </div>
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                Start a conversation with {persona.name}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Type your question below and receive a personalized voice response.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.isUser
                    ? `bg-gradient-to-r ${styles.gradient} text-white`
                    : `glass-card ${styles.border}`
                }`}
              >
                <p className="text-sm">{message.text}</p>

                {message.audioUrl && (
                  <button
                    onClick={() => playAudio(message.audioUrl!, message.id)}
                    className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg ${styles.bg} ${styles.text} hover:opacity-80 transition-opacity`}
                  >
                    <Volume2 className={`w-4 h-4 ${playingId === message.id ? 'animate-pulse' : ''}`} />
                    <span className="text-xs font-medium">
                      {playingId === message.id ? 'Playing...' : 'Play Voice'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className={`glass-card ${styles.border} rounded-2xl px-4 py-3`}>
                <div className="flex items-center gap-2">
                  <Loader2 className={`w-4 h-4 animate-spin ${styles.text}`} />
                  <span className="text-sm text-muted-foreground">
                    {persona.name} is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`glass-card border-t ${styles.border} px-4 py-4`}>
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${persona.name} anything...`}
            className="flex-1 bg-secondary border-border focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className={`bg-gradient-to-r ${styles.gradient} hover:opacity-90 transition-opacity`}
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
