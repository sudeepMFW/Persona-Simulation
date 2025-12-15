import { Sparkles } from 'lucide-react';

export function Logo() {
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
          Your Company
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Persona Simulator
        </p>
      </div>
    </div>
  );
}
