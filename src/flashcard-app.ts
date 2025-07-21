import { GeminiService } from './gemini-service';
import { FileService } from './file-service';
import { FlashcardUI } from './flashcard-ui';
import type { FlashCard, ObsidianNote } from './types';

export class FlashcardApp {
  private geminiService: GeminiService;
  private fileService: FileService;
  private flashcardUI: FlashcardUI;
  private loadingElement: HTMLElement;
  private statusElement: HTMLElement;

  constructor() {
    this.geminiService = new GeminiService();
    this.fileService = new FileService();
    
    const flashcardContainer = document.querySelector('#flashcard-container') as HTMLElement;
    this.flashcardUI = new FlashcardUI(flashcardContainer);
    
    this.loadingElement = document.querySelector('#loading') as HTMLElement;
    this.statusElement = document.querySelector('#status') as HTMLElement;
    
    this.initializeEventListeners();
    this.checkBrowserSupport();
  }

  private initializeEventListeners(): void {
    const loadFolderBtn = document.querySelector('#load-folder-btn') as HTMLButtonElement;
    const loadFileBtn = document.querySelector('#load-file-btn') as HTMLButtonElement;
    const clearBtn = document.querySelector('#clear-btn') as HTMLButtonElement;

    if (loadFolderBtn) {
      loadFolderBtn.addEventListener('click', () => this.loadObsidianFolder());
    }

    if (loadFileBtn) {
      loadFileBtn.addEventListener('click', () => this.loadSingleFile());
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearFlashcards());
    }
  }

  private checkBrowserSupport(): void {
    if (!this.fileService.isFileSystemAccessSupported()) {
      this.showStatus('Warning: File System Access API is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser.', 'warning');
      
      const loadFolderBtn = document.querySelector('#load-folder-btn') as HTMLButtonElement;
      if (loadFolderBtn) {
        loadFolderBtn.disabled = true;
        loadFolderBtn.textContent = 'Folder Loading Not Supported';
      }
    }
  }

  async loadObsidianFolder(): Promise<void> {
    try {
      this.showLoading(true);
      this.showStatus('Selecting Obsidian folder...', 'info');

      const notes = await this.fileService.readObsidianNotes();
      
      if (notes.length === 0) {
        this.showStatus('No markdown files found in the selected folder.', 'warning');
        return;
      }

      this.showStatus(`Found ${notes.length} notes. Generating flashcards...`, 'info');
      await this.processNotes(notes);

    } catch (error) {
      console.error('Error loading folder:', error);
      this.showStatus('Failed to load notes from folder. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  async loadSingleFile(): Promise<void> {
    try {
      this.showLoading(true);
      this.showStatus('Selecting markdown file...', 'info');

      const note = await this.fileService.readSingleFile();
      
      if (!note) {
        this.showStatus('No file selected.', 'warning');
        return;
      }

      this.showStatus('Generating flashcards from selected file...', 'info');
      await this.processNotes([note]);

    } catch (error) {
      console.error('Error loading file:', error);
      this.showStatus('Failed to load the selected file. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  private async processNotes(notes: ObsidianNote[]): Promise<void> {
    const allFlashcards: FlashCard[] = [];
    let processedCount = 0;
    let errorCount = 0;

    for (const note of notes) {
      try {
        this.showStatus(`Processing ${note.filename} (${processedCount + 1}/${notes.length})...`, 'info');
        
        // Skip very short notes (less than 100 characters)
        if (note.content.trim().length < 100) {
          console.log(`Skipping ${note.filename} - too short`);
          processedCount++;
          continue;
        }

        const flashcards = await this.geminiService.generateFlashcards(note);
        allFlashcards.push(...flashcards);
        processedCount++;

        // Add a small delay to avoid hitting API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing ${note.filename}:`, error);
        errorCount++;
        processedCount++;
      }
    }

    if (allFlashcards.length === 0) {
      this.showStatus('No flashcards were generated. Please check your notes and try again.', 'warning');
    } else {
      this.flashcardUI.addFlashcards(allFlashcards);
      const successMessage = `Generated ${allFlashcards.length} flashcards from ${processedCount - errorCount} notes.`;
      const errorMessage = errorCount > 0 ? ` (${errorCount} files failed)` : '';
      this.showStatus(successMessage + errorMessage, 'success');
    }
  }

  private clearFlashcards(): void {
    this.flashcardUI.clear();
    this.showStatus('Flashcards cleared.', 'info');
  }

  private showLoading(show: boolean): void {
    if (this.loadingElement) {
      this.loadingElement.style.display = show ? 'block' : 'none';
    }
  }

  private showStatus(message: string, type: 'info' | 'success' | 'warning' | 'error'): void {
    if (this.statusElement) {
      this.statusElement.textContent = message;
      this.statusElement.className = `status ${type}`;
      this.statusElement.style.display = 'block';

      // Auto-hide success and info messages after 5 seconds
      if (type === 'success' || type === 'info') {
        setTimeout(() => {
          if (this.statusElement.textContent === message) {
            this.statusElement.style.display = 'none';
          }
        }, 5000);
      }
    }
  }
}
