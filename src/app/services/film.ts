import { Injectable, inject, signal } from '@angular/core';
import { RechercheImdb, ResultatImdb } from './recherche-imdb';
import { Youtube } from './youtube';
import { map, Observable, of, switchMap } from 'rxjs';

export interface DetailFilm extends ResultatImdb {
  videoId?: string | null;
  synopsis?: string;
  note?: string;
  genre?: string;
  directeur?: string;
  youtubeTitre?: string;
  youtubeDescription?: string;
}

@Injectable({ providedIn: 'root' })
export class FilmService {
  private imdb = inject(RechercheImdb);
  private youtube = inject(Youtube);

  filmsPopulaires = signal<ResultatImdb[]>([]);
  seriesPopulaires = signal<ResultatImdb[]>([]);
  vedette = signal<ResultatImdb | null>(null);
  chargement = signal<boolean>(false);

  initialiser() {
    this.chargement.set(true);
    
    // Récupérer les films et séries populaires
    this.imdb.rechercher('2024 movies').subscribe(films => {
      this.filmsPopulaires.set(films.slice(0, 15));
      if (films.length > 0) this.vedette.set(films[0]);
    });

    this.imdb.rechercher('netflix series').subscribe(series => {
      this.seriesPopulaires.set(series.slice(0, 15));
      this.chargement.set(false);
    });
  }

  rechercher(requete: string): Observable<ResultatImdb[]> {
    return this.imdb.rechercher(requete);
  }

  recupererDetailComplet(id: string): Observable<DetailFilm | null> {
    return this.imdb.rechercherParId(id).pipe(
      switchMap(film => {
        if (!film) return of(null);
        return this.youtube.recupererBandeAnnonce(film.l).pipe(
          map(detailsYoutube => ({
            ...film,
            videoId: detailsYoutube?.videoId,
            youtubeTitre: detailsYoutube?.titre,
            youtubeDescription: detailsYoutube?.description
          } as DetailFilm))
        );
      })
    );
  }
}
