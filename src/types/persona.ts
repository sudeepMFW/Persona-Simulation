export interface Persona {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string;
  color: 'nikhil' | 'kiran' | 'sima';
  expertise: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  audioUrl?: string;
  timestamp: Date;
}
