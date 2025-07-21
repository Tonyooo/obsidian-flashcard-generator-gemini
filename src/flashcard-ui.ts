import type { FlashCard } from './types';

export class FlashcardUI {
  private container: HTMLElement;
  private flashcards: FlashCard[] = [];
  private currentIndex = 0;
  private showingAnswer = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  setFlashcards(flashcards: FlashCard[]): void {
    this.flashcards = flashcards;
    this.currentIndex = 0;
    this.showingAnswer = false;
    this.render();
  }

  private render(): void {
    if (this.flashcards.length === 0) {
      this.container.innerHTML = `
        <div class="flashcard-container">
          <div class="empty-state">
            <div class="empty-icon">🎴</div>
            <h3>No flashcards yet</h3>
            <p>Load your Obsidian notes to generate intelligent flashcards</p>
          </div>
        </div>
      `;
      return;
    }

    const currentCard = this.flashcards[this.currentIndex];
    
    this.container.innerHTML = `
      <div class="flashcard-container">
        <div class="flashcard-header">
          <span class="card-counter">${this.currentIndex + 1} / ${this.flashcards.length}</span>
          <span class="card-source">From: ${currentCard.source}</span>
        </div>
        
        <div class="flashcard ${this.showingAnswer ? 'showing-answer' : 'showing-question'}">
          <div class="card-content">
            <div class="question-side ${!this.showingAnswer ? 'active' : ''}">
              <h3>Question</h3>
              <p>${currentCard.question}</p>
            </div>
            
            <div class="answer-side ${this.showingAnswer ? 'active' : ''}">
              <h3>Answer</h3>
              <p>${currentCard.answer}</p>
            </div>
          </div>
          
          ${currentCard.tags && currentCard.tags.length > 0 ? `
            <div class="tags">
              ${currentCard.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
        
        <div class="flashcard-controls">
          <button id="prev-btn" ${this.currentIndex === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          <button id="flip-btn">
            ${this.showingAnswer ? '❓ Show Question' : '💡 Show Answer'}
          </button>
          <button id="next-btn" ${this.currentIndex === this.flashcards.length - 1 ? 'disabled' : ''}>
            Next →
          </button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    const prevBtn = this.container.querySelector('#prev-btn') as HTMLButtonElement;
    const nextBtn = this.container.querySelector('#next-btn') as HTMLButtonElement;
    const flipBtn = this.container.querySelector('#flip-btn') as HTMLButtonElement;

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousCard());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextCard());
    }

    if (flipBtn) {
      flipBtn.addEventListener('click', () => this.flipCard());
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          this.previousCard();
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.nextCard();
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          this.flipCard();
          break;
      }
    });
  }

  private previousCard(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showingAnswer = false;
      this.render();
    }
  }

  private nextCard(): void {
    if (this.currentIndex < this.flashcards.length - 1) {
      this.currentIndex++;
      this.showingAnswer = false;
      this.render();
    }
  }

  private flipCard(): void {
    this.showingAnswer = !this.showingAnswer;
    this.render();
  }

  addFlashcards(newCards: FlashCard[]): void {
    this.flashcards.push(...newCards);
    if (this.flashcards.length === newCards.length) {
      // If these are the first cards, start displaying them
      this.currentIndex = 0;
      this.showingAnswer = false;
    }
    this.render();
  }

  clear(): void {
    this.flashcards = [];
    this.currentIndex = 0;
    this.showingAnswer = false;
    this.render();
  }
}
