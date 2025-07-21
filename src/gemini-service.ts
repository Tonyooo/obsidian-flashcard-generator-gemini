import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FlashCard, ObsidianNote } from './types';

const GEMINI_API_KEY = '<my-key>>';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateFlashcards(note: ObsidianNote): Promise<FlashCard[]> {
    try {
      const prompt = this.createPrompt(note);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseFlashcards(text, note.filename);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      throw new Error('Failed to generate flashcards from Gemini API');
    }
  }

  private createPrompt(note: ObsidianNote): string {
    return `
You are an expert at creating educational flashcards from study notes. 

Analyze the following note content and generate 3-5 high-quality flashcards that test key concepts, definitions, and important facts.

Note filename: ${note.filename}
Note content:
${note.content}

IMPORTANT: Please respond with ONLY a valid JSON array in the following format, with no additional text or formatting:

[
  {
    "question": "Clear, specific question about a key concept",
    "answer": "Concise, accurate answer",
    "tags": ["relevant", "topic", "tags"]
  }
]

Guidelines for flashcard creation:
- Focus on the most important concepts and facts
- Make questions specific and unambiguous
- Keep answers concise but complete
- Include relevant tags based on the content topic
- Ensure questions test understanding, not just memorization
- Extract key definitions, processes, and relationships
- Make sure each flashcard stands alone and makes sense
`;
  }

  private parseFlashcards(response: string, sourceFilename: string): FlashCard[] {
    try {
      // Clean the response to ensure it's valid JSON
      let cleanResponse = response.trim();
      
      // Remove any markdown code block markers
      cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
      cleanResponse = cleanResponse.replace(/```\s*/, '');
      
      const flashcardsData = JSON.parse(cleanResponse);
      
      if (!Array.isArray(flashcardsData)) {
        throw new Error('Response is not an array');
      }

      return flashcardsData.map((card: any, index: number) => ({
        id: `${sourceFilename}-${index}`,
        question: card.question,
        answer: card.answer,
        source: sourceFilename,
        tags: card.tags || []
      }));
    } catch (error) {
      console.error('Error parsing flashcards:', error);
      console.error('Raw response:', response);
      throw new Error('Failed to parse flashcards from API response');
    }
  }
}
