import { useState } from 'react';
import { Logo } from '@/components/Logo';
import { PersonaCard } from '@/components/PersonaCard';
import { ChatInterface } from '@/components/ChatInterface';
import { personas } from '@/data/personas';
import { Persona } from '@/types/persona';
import { Sparkles } from 'lucide-react';

const Index = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-card border-b border-border/50 sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <Logo src="https://mediafirewall.ai/images/logo.png" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Meet AI Personas
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
            Build conversational {' '}
            <span className="gradient-text-primary">AI personas in 30 mins</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
          Powered by trusted public sources from Wikipedia — fast, flexible, and customizable.
          </p>
        </section>

        {/* Personas Grid */}
        <section className="container mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {personas.map((persona, index) => (
              <div
                key={persona.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PersonaCard
                  persona={persona}
                  onClick={() => setSelectedPersona(persona)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="glass-card border-t border-border/50 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              MediaFireWall.Inc.
            </p>
          </div>
        </footer>
      </div>

      {/* Chat Interface Modal */}
      {selectedPersona && (
        <ChatInterface
          persona={selectedPersona}
          onBack={() => setSelectedPersona(null)}
        />
      )}
    </div>
  );
};

export default Index;
