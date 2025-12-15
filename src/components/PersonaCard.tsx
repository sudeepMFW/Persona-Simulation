import { Persona } from '@/types/persona';
import { MessageCircle } from 'lucide-react';

interface PersonaCardProps {
  persona: Persona;
  onClick: () => void;
}

const colorStyles = {
  nikhil: {
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'glow-primary',
    border: 'hover:border-cyan-500/50',
    badge: 'bg-cyan-500/20 text-cyan-400',
  },
  kiran: {
    gradient: 'from-purple-500 to-pink-500',
    glow: 'glow-accent',
    border: 'hover:border-purple-500/50',
    badge: 'bg-purple-500/20 text-purple-400',
  },
  sima: {
    gradient: 'from-rose-500 to-orange-500',
    glow: 'glow-warm',
    border: 'hover:border-rose-500/50',
    badge: 'bg-rose-500/20 text-rose-400',
  },
};

export function PersonaCard({ persona, onClick }: PersonaCardProps) {
  const styles = colorStyles[persona.color];

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-500 transform hover:scale-105 ${styles.border} group`}
    >
      {/* Avatar with gradient ring */}
      <div className="relative mx-auto w-32 h-32 mb-6">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
        <div className={`relative w-full h-full rounded-full bg-gradient-to-r ${styles.gradient} p-1`}>
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
            {persona.avatar ? (
              <img 
                src={persona.avatar} 
                alt={persona.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className={`text-4xl font-display font-bold bg-gradient-to-r ${styles.gradient} bg-clip-text text-transparent`}>
                {persona.name[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Name and Title */}
      <h3 className="text-xl font-display font-bold text-foreground text-center mb-1">
        {persona.name}
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        {persona.title}
      </p>

      {/* Description */}
      <p className="text-sm text-muted-foreground text-center mb-6 line-clamp-3">
        {persona.description}
      </p>

      {/* Expertise Tags */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {persona.expertise.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className={`px-3 py-1 rounded-full text-xs font-medium ${styles.badge}`}
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Chat Button */}
      <button
        className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${styles.gradient} text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg group-hover:scale-105`}
      >
        <MessageCircle className="w-5 h-5" />
        Start Conversation
      </button>
    </div>
  );
}
