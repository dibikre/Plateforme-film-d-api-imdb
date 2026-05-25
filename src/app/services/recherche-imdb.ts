import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigService } from './config';

export interface VideoImdb {
  i?: { imageUrl: string; width: number; height: number };
  id: string;
  l: string;
  s: string;
}

export interface ResultatImdb {
  id: string;
  l: string;
  y?: number;
  yr?: string;
  q?: string;
  qid?: string;
  s?: string;
  i?: { imageUrl: string; width: number; height: number };
  rank?: number;
  vt?: number;
  v?: VideoImdb[];
}

interface ReponseRechercheOmdb {
  Response: string;
  Search?: {
    imdbID: string;
    Title: string;
    Year: string;
    Type: string;
    Poster: string;
  }[];
}

interface DetailOmdb {
  Response: string;
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Actors: string;
  Poster: string;
}

@Injectable({ providedIn: 'root' })
export class RechercheImdb {
  private readonly PROXY = '/api/imdb-proxy';
  private readonly OMDB_PROXY = '/api/omdb-proxy';
  private http = inject(HttpClient);
  private config = inject(ConfigService);

  private getHeader() {
    const key = this.config.omdbKey();
    return key ? new HttpHeaders().set('x-custom-key', key) : undefined;
  }

  rechercher(requete: string): Observable<ResultatImdb[]> {
    if (!requete.trim()) return of([]);
    const q = encodeURIComponent(requete.trim().replace(/\s+/g, '_'));
    const url = `${this.PROXY}/titles/x/${q}.json?includeVideos=1`;
    
    return this.http.get<{ d: ResultatImdb[] }>(url).pipe(
      map(res => {
        const films = (res.d ?? []).filter(item => item.id?.startsWith('tt'));
        if (films.length === 0) throw new Error('Aucun résultat IMDb');
        return films;
      }),
      catchError(() => this.fallbackOmdbRecherche(requete))
    );
  }

  rechercherParId(id: string): Observable<ResultatImdb | null> {
    return this.http.get<{ d: ResultatImdb[] }>(
      `${this.PROXY}/x/${id}.json`
    ).pipe(
      map(res => {
        const found = (res.d ?? []).find(item => item.id === id);
        if (!found) throw new Error('Non trouvé sur IMDb');
        return found;
      }),
      catchError(() => this.fallbackOmdbParId(id))
    );
  }

  rechercherParRequete(requete: string): Observable<ResultatImdb[]> {
    return this.rechercher(requete);
  }

  private fallbackOmdbRecherche(requete: string): Observable<ResultatImdb[]> {
    const url = `${this.OMDB_PROXY}?s=${encodeURIComponent(requete)}`;
    return this.http.get<ReponseRechercheOmdb>(url, { headers: this.getHeader() }).pipe(
      map(res => {
        if (res.Response === 'False') return [];
        return (res.Search || []).map((m) => ({
          id: m.imdbID,
          l:  m.Title,
          yr: m.Year,
          y:  parseInt(m.Year),
          q:  m.Type,
          i:  m.Poster && m.Poster !== 'N/A' ? { imageUrl: m.Poster, width: 0, height: 0 } : undefined
        }));
      }),
      catchError(() => of([]))
    );
  }

  private fallbackOmdbParId(id: string): Observable<ResultatImdb | null> {
    const url = `${this.OMDB_PROXY}?i=${id}&plot=full`;
    return this.http.get<DetailOmdb>(url, { headers: this.getHeader() }).pipe(
      map(m => {
        if (m.Response === 'False') return null;
        return {
          id: m.imdbID,
          l:  m.Title,
          yr: m.Year,
          y:  parseInt(m.Year),
          q:  m.Type,
          s:  m.Actors,
          i:  m.Poster && m.Poster !== 'N/A' ? { imageUrl: m.Poster, width: 0, height: 0 } : undefined
        };
      }),
      catchError(() => of(null))
    );
  }
}
