import { Injectable, signal } from '@angular/core';
import { ResultatImdb } from './recherche-imdb';
import { Acteur } from './acteur';

@Injectable({
  providedIn: 'root'
})
export class FavorisService {
  private readonly CLE_FILMS = 'sph_films_fav';
  private readonly CLE_ACTEURS = 'sph_acteurs_fav';

  private listeFilms = signal<ResultatImdb[]>(this.charger<ResultatImdb>('films'));
  private listeActeurs = signal<Acteur[]>(this.charger<Acteur>('acteurs'));

  recupererFilms() {
    return this.listeFilms.asReadonly();
  }

  recupererActeurs() {
    return this.listeActeurs.asReadonly();
  }

  basculerFilm(film: ResultatImdb): void {
    const actuel = this.listeFilms();
    const index = actuel.findIndex(f => f.id === film.id);
    
    if (index > -1) {
      this.listeFilms.set(actuel.filter(f => f.id !== film.id));
    } else {
      this.listeFilms.set([film, ...actuel]);
    }
    this.sauvegarder('films');
  }

  basculerActeur(acteur: Acteur): void {
    const actuel = this.listeActeurs();
    const index = actuel.findIndex(a => a.id === acteur.id);
    
    if (index > -1) {
      this.listeActeurs.set(actuel.filter(a => a.id !== acteur.id));
    } else {
      this.listeActeurs.set([acteur, ...actuel]);
    }
    this.sauvegarder('acteurs');
  }

  estFilmFavori(id: string): boolean {
    return this.listeFilms().some(f => f.id === id);
  }

  estActeurFavori(id: string): boolean {
    return this.listeActeurs().some(a => a.id === id);
  }

  viderTout(): void {
    this.listeFilms.set([]);
    this.listeActeurs.set([]);
    this.sauvegarder('films');
    this.sauvegarder('acteurs');
  }

  private charger<T>(type: 'films' | 'acteurs'): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const cle = type === 'films' ? this.CLE_FILMS : this.CLE_ACTEURS;
      const stocke = localStorage.getItem(cle);
      if (!stocke) return [];
      // Décodage "hashe" (Base64)
      return JSON.parse(atob(stocke)) as T[];
    } catch {
      return [];
    }
  }

  private sauvegarder(type: 'films' | 'acteurs') {
    if (typeof window === 'undefined') return;
    try {
      const cle = type === 'films' ? this.CLE_FILMS : this.CLE_ACTEURS;
      const data = type === 'films' ? this.listeFilms() : this.listeActeurs();
      // Encodage "hashe" (Base64)
      const encode = btoa(JSON.stringify(data));
      localStorage.setItem(cle, encode);
    } catch (e) {
      console.warn('Erreur sauvegarde favoris', e);
    }
  }
}
