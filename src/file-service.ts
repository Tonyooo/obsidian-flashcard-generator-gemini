import type { ObsidianNote } from './types';

export class FileService {
  async readObsidianNotes(): Promise<ObsidianNote[]> {
    try {
      // Use the File System Access API to let the user select their Obsidian folder
      const directoryHandle = await (window as any).showDirectoryPicker({
        mode: 'read'
      });
      
      const notes: ObsidianNote[] = [];
      await this.processDirectory(directoryHandle, notes);
      
      return notes;
    } catch (error) {
      console.error('Error reading Obsidian notes:', error);
      throw new Error('Failed to read notes from selected directory');
    }
  }

  private async processDirectory(directoryHandle: any, notes: ObsidianNote[], path = ''): Promise<void> {
    for await (const [name, handle] of directoryHandle.entries()) {
      const currentPath = path ? `${path}/${name}` : name;
      
      if (handle.kind === 'file' && name.endsWith('.md')) {
        try {
          const file = await handle.getFile();
          const content = await file.text();
          
          notes.push({
            filename: name,
            content: content,
            path: currentPath
          });
        } catch (error) {
          console.warn(`Failed to read file ${currentPath}:`, error);
        }
      } else if (handle.kind === 'directory' && !name.startsWith('.')) {
        // Recursively process subdirectories, but skip hidden directories
        await this.processDirectory(handle, notes, currentPath);
      }
    }
  }

  async readSingleFile(): Promise<ObsidianNote | null> {
    try {
      const [fileHandle] = await (window as any).showOpenFilePicker({
        types: [
          {
            description: 'Markdown files',
            accept: {
              'text/markdown': ['.md']
            }
          }
        ]
      });
      
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      return {
        filename: file.name,
        content: content,
        path: file.name
      };
    } catch (error) {
      console.error('Error reading single file:', error);
      return null;
    }
  }

  isFileSystemAccessSupported(): boolean {
    return 'showDirectoryPicker' in window && 'showOpenFilePicker' in window;
  }
}
