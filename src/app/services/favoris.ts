import { Injectable, signal } from '@angular/core';
import { ResultatImdb } from './recherche-imdb';

@Injectable({
  providedIn: 'root'
})
export class FavorisService {
  private readonly CLE_STOCKAGE = 'films_favoris_data';
  private listeFavoris = signal<ResultatImdb[]>(this.chargerFavoris());

  recupererListeFavoris() {
    return this.listeFavoris.asReadonly();
  }

  basculerFavori(film: ResultatImdb): void {
    const actuel = this.listeFavoris();
    const index = actuel.findIndex(f => f.id === film.id);
    
    if (index > -1) {
      const misAJour = actuel.filter(f => f.id !== film.id);
      this.listeFavoris.set(misAJour);
    } else {
      const misAJour = [film, ...actuel];
      this.listeFavoris.set(misAJour);
    }
    this.sauvegarderFavoris();
  }

  estDansFavoris(filmId: string): boolean {
    return this.listeFavoris().some(f => f.id === filmId);
  }

  private chargerFavoris(): ResultatImdb[] {
    if (typeof window === 'undefined') return [];
    try {
      const stocke = localStorage.getItem(this.CLE_STOCKAGE);
      return stocke ? JSON.parse(stocke) : [];
    } catch {
      return [];
    }
  }

  private sauvegarderFavoris() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CLE_STOCKAGE, JSON.stringify(this.listeFavoris()));
  }
}
