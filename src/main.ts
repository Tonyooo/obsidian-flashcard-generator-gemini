import './style.css'
import { FlashcardApp } from './flashcard-app'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="container">
    <header>
      <h1>🧠 Obsidian Flashcard Generator</h1>
      <p>Transform your Obsidian notes into intelligent flashcards powered by AI</p>
    </header>

    <main>
      <div class="controls">
        <button id="load-folder-btn" class="btn btn-primary">
          📁 Load Obsidian Folder
        </button>
        <button id="load-file-btn" class="btn btn-secondary">
          📄 Load Single File
        </button>
        <button id="clear-btn" class="btn btn-danger">
          🗑️ Clear All
        </button>
      </div>

      <div id="loading" class="loading" style="display: none;">
        <div class="spinner"></div>
        <p>✨ Processing notes and generating flashcards...</p>
      </div>

      <div id="status" class="status" style="display: none;"></div>

      <div id="flashcard-container" class="flashcard-wrapper">
        <!-- Flashcards will be rendered here -->
      </div>
    </main>

    <footer>
      <p>🤖 Powered by Google Gemini AI</p>
      <p>💡 Tip: Use ← → arrow keys to navigate • Spacebar to flip cards</p>
    </footer>
  </div>
`

// Initialize the flashcard application
new FlashcardApp()
