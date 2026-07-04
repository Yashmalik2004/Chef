const BASE_URL = 'http://localhost:8000';

export const api = {
  async downloadProject(): Promise<void> {
    const response = await fetch(`${BASE_URL}/download`);
    if (!response.ok) throw new Error('Download failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated_project.zip';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  async getFiles(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/files`);
    if (!response.ok) throw new Error('Failed to fetch files');
    const data = await response.json();
    return data.files ?? [];
  },

  async health(): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
      return response.ok;
    } catch {
      return false;
    }
  },
};

export const WS_URL = 'ws://localhost:8000/ws';
