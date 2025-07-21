# 🧠 Obsidian Flashcard Generator

An intelligent TypeScript web application that automatically generates flashcards from your Obsidian notes using Google's Gemini AI.

## ✨ Features

- **📁 Batch Processing**: Load entire Obsidian folders or individual markdown files
- **🤖 AI-Powered**: Uses Google Gemini API to generate intelligent flashcards
- **🎯 Smart Content Analysis**: Extracts key concepts, definitions, and important facts
- **🎴 Interactive UI**: Beautiful flashcard interface with flip animations
- **⌨️ Keyboard Navigation**: Use arrow keys and spacebar for navigation
- **🏷️ Automatic Tagging**: AI generates relevant tags for each flashcard
- **📱 Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- **Modern Browser**: Chrome, Edge, or other Chromium-based browser (required for File System Access API)
- **Node.js**: Version 16 or higher
- **Google Gemini API Key**: Your personal API key (already configured in this app)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 📖 How to Use

1. **Launch the application** using `npm run dev`

2. **Choose your loading method**:
   - **📁 Load Obsidian Folder**: Select your entire Obsidian vault directory
   - **📄 Load Single File**: Select individual markdown files

3. **Wait for processing**: The AI will analyze your notes and generate flashcards

4. **Study with your flashcards**:
   - Click "Show Answer" or press `Space` to flip cards
   - Use "Previous/Next" buttons or `←/→` arrow keys to navigate
   - View source information and tags for each card

## 🛠️ Technical Stack

- **Frontend**: TypeScript + Vite
- **AI Service**: Google Gemini 1.5 Flash
- **File Access**: File System Access API
- **Styling**: Modern CSS with animations

## 📁 Project Structure

```
src/
├── types.ts              # TypeScript interfaces
├── gemini-service.ts     # AI integration
├── file-service.ts       # File reading functionality
├── flashcard-ui.ts       # UI components
├── flashcard-app.ts      # Main application controller
├── main.ts              # Entry point
└── style.css            # Styling
```

## 🔧 Configuration

The Gemini API key is pre-configured in `src/gemini-service.ts`. If you need to change it:

```typescript
const GEMINI_API_KEY = 'your-api-key-here';
```

## 🌟 Features in Detail

### AI-Powered Flashcard Generation
- Analyzes markdown content to identify key concepts
- Generates clear, specific questions
- Provides concise, accurate answers
- Creates relevant topic tags

### File System Integration
- Reads markdown files directly from your file system
- Supports both single files and entire directories
- Recursively processes subdirectories
- Filters for `.md` files only

### Interactive Flashcard Experience
- Smooth flip animations
- Progress tracking (card X of Y)
- Source file attribution
- Keyboard shortcuts for efficient studying

## 📝 Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔍 Browser Compatibility

This application uses the File System Access API, which requires a modern Chromium-based browser:
- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Opera
- ❌ Firefox (not supported)
- ❌ Safari (not supported)

For unsupported browsers, the single file loading option will still work.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent content analysis
- **Vite** for fast development experience
- **Obsidian** for inspiring note-taking workflows
