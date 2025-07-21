export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  source: string; // The note filename this card was generated from
  tags?: string[];
}

export interface ObsidianNote {
  filename: string;
  content: string;
  path: string;
}

export interface GeminiResponse {
  flashcards: FlashCard[];
}
