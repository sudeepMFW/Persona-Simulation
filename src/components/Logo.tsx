import { Sparkles } from 'lucide-react';

interface LogoProps {
  src?: string;
}

export function Logo({ src }: LogoProps) {
  if (src) {
    return (
      <img 
        src={src} 
        alt="Company Logo" 
        className="h-14 object-contain"
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-rose-500 flex items-center justify-center animate-pulse-glow">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 via-purple-500 to-rose-500 blur-xl opacity-50" />
      </div>
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          MediaFireWall.Inc
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Persona Simulator
        </p>
      </div>
    </div>
  );
}
