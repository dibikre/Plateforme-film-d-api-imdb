import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly STORAGE_KEY_YOUTUBE = 'user_yt_key';
  private readonly STORAGE_KEY_OMDB = 'user_omdb_key';

  youtubeKey = signal<string | null>(this.recupererClé(this.STORAGE_KEY_YOUTUBE));
  omdbKey = signal<string | null>(this.recupererClé(this.STORAGE_KEY_OMDB));

  enregistrerYouTubeKey(key: string) {
    if (!key) {
      this.supprimerClé(this.STORAGE_KEY_YOUTUBE);
      this.youtubeKey.set(null);
      return;
    }
    const encoded = btoa(key);
    localStorage.setItem(this.STORAGE_KEY_YOUTUBE, encoded);
    this.youtubeKey.set(key);
  }

  enregistrerOmdbKey(key: string) {
    if (!key) {
      this.supprimerClé(this.STORAGE_KEY_OMDB);
      this.omdbKey.set(null);
      return;
    }
    const encoded = btoa(key);
    localStorage.setItem(this.STORAGE_KEY_OMDB, encoded);
    this.omdbKey.set(key);
  }

  private recupererClé(storageKey: string): string | null {
    try {
      const value = localStorage.getItem(storageKey);
      return value ? atob(value) : null;
    } catch {
      return null;
    }
  }

  private supprimerClé(storageKey: string) {
    localStorage.removeItem(storageKey);
  }
}
