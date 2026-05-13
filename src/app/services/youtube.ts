import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { API_YOUTUBE } from '../configuration/config-api';

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

  recupererBandeAnnonce(titre: string): Observable<DetailVideoYoutube | null> {
    const requete = encodeURIComponent(`${titre} official trailer`);
    const url = `${API_YOUTUBE.baseUrl}/search?key=${API_YOUTUBE.cle}&q=${requete}&part=snippet&type=video&maxResults=1`;

    return this.http.get<ReponseRechercheYoutube>(url).pipe(
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
