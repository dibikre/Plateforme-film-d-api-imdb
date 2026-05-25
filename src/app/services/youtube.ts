import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ACTIVER_YOUTUBE } from '../configuration/config-api';
import { ConfigService } from './config';

interface ReponseRechercheYoutube {
  items: {
    id: {
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
    };
  }[];
}

export interface DetailVideoYoutube {
  videoId: string;
  titre: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class Youtube {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private readonly PROXY = '/api/youtube-proxy';

  recupererBandeAnnonce(titre: string): Observable<DetailVideoYoutube | null> {
    if (!ACTIVER_YOUTUBE && !this.config.youtubeKey()) {
      console.log('YouTube API désactivée par configuration et aucune clé personnalisée');
      return of(null);
    }

    // Nettoyage intelligent du titre
    let titreRecherche = titre.replace(/UNTITLED\s+/i, '').replace(/PROJECT\s*$/i, '').trim();
    if (!titreRecherche) titreRecherche = titre;

    // On essaie d'abord avec le titre + trailer
    return this.rechercher(`${titreRecherche} trailer`).pipe(
      switchMap(video => {
        if (video) return of(video);
        // Deuxième essai : titre + official trailer (plus spécifique)
        return this.rechercher(`${titreRecherche} official trailer`);
      }),
      switchMap(video => {
        if (video) return of(video);
        // Si rien trouvé, on essaie juste le titre (le plus large possible)
        return this.rechercher(titreRecherche);
      }),
      catchError(() => of(null))
    );
  }

  private rechercher(q: string): Observable<DetailVideoYoutube | null> {
    const url = `${this.PROXY}?q=${encodeURIComponent(q)}&part=snippet&type=video&maxResults=1`;
    let headers = new HttpHeaders();
    const customKey = this.config.youtubeKey();
    if (customKey) {
      headers = headers.set('x-custom-key', customKey);
    }

    return this.http.get<ReponseRechercheYoutube>(url, { headers }).pipe(
      map(res => {
        if (res.items && res.items.length > 0) {
          const item = res.items[0];
          return {
            videoId: item.id.videoId,
            titre: item.snippet.title,
            description: item.snippet.description
          };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }
}
