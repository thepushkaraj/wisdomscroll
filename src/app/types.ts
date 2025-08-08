export interface WikipediaPage {
  pageid: number;
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageimage?: string;
  fullurl: string;
}

export interface WikipediaResponse {
  query: {
    pages: Record<string, WikipediaPage>;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ArticleCardProps {
  article: WikipediaPage;
  isActive: boolean;
  onChatClick: () => void;
} 