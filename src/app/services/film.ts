import { Injectable, inject, signal } from '@angular/core';
import { RechercheImdb, ResultatImdb } from './recherche-imdb';
import { Youtube } from './youtube';
import { map, Observable, of, switchMap, forkJoin } from 'rxjs';
import { MOTS_CLES_VOGUE } from '../configuration/config-api';

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

  private melanger<T>(tableau: T[]): T[] {
    const copie = [...tableau];
    for (let i = copie.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copie[i], copie[j]] = [copie[j], copie[i]];
    }
    return copie;
  }

  initialiser() {
    if (this.chargement()) return;
    this.chargement.set(true);
    
    // Récupérer le contenu basé sur les mots-clés "Vogue"
    const observations = MOTS_CLES_VOGUE.map(mot => this.imdb.rechercher(mot));
    
    forkJoin(observations).subscribe(batchResultats => {
      const tousLesResultats = batchResultats.flat();
      
      // Déduplication par ID
      const vus = new Set();
      const uniques = tousLesResultats.filter(item => {
        if (vus.has(item.id)) return false;
        vus.add(item.id);
        return true;
      });

      // Séparation Films / Séries (basé sur le champ q ou qid si dispo, sinon on tente de deviner)
      // Dans recher-imdb.ts fallback OMDB met le type dans 'q'
      const films = uniques.filter(item => 
        item.q === 'movie' || item.q === 'feature' || !item.q || item.id.startsWith('tt')
      );
      
      const series = uniques.filter(item => 
        item.q?.toLowerCase().includes('series') || item.q?.toLowerCase().includes('tv') || item.q === 'series'
      );

      // Mélanger (Randomiser) les listes pour éviter d'avoir tous les films d'un même terme regroupés
      const filmsMelanges = this.melanger(films);
      const seriesMelanges = this.melanger(series);
      
      this.filmsPopulaires.set(filmsMelanges);
      this.seriesPopulaires.set(seriesMelanges);
      
      // Fallback si seriesPopulaires est vide, on cherche quand même 'trending series'
      if (seriesMelanges.length === 0) {
          this.imdb.rechercher('trending series').subscribe(res => {
              this.seriesPopulaires.set(this.melanger(res));
          });
      }

      this.choisirVedetteAleatoire();
      this.chargement.set(false);
    });
  }

  choisirVedetteAleatoire() {
    const tous = [...this.filmsPopulaires(), ...this.seriesPopulaires()];
    if (tous.length > 0) {
      const index = Math.floor(Math.random() * tous.length);
      this.vedette.set(tous[index]);
    }
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
