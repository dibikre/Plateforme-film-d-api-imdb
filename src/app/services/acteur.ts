import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { map, catchError, mergeMap, scan, startWith } from 'rxjs/operators';

export interface Acteur {
  id: string;
  imageProfil: string;
  nom: string;
  professionsListe: string;
  listeIdFilms: string;
  descriptions: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActeurService {
  private http = inject(HttpClient);
  
  // On liste tous les lots potentiels
  private readonly FICHIERS_LOTS = [
    '/donnees/acteurs/lot1.csv',
    '/donnees/acteurs/lot2.csv',
    '/donnees/acteurs/lot3.csv',
    '/donnees/acteurs/lot4.csv',
    '/donnees/acteurs/lot5.csv',
    '/donnees/acteurs/lot6.csv',
    '/donnees/acteurs/lot7.csv',
    '/donnees/acteurs/lot8.csv',
    '/donnees/acteurs/lot9.csv',
    '/donnees/acteurs/lot10.csv',
    '/donnees/acteurs/lot11.csv'
  ];

  /**
   * Récupère les acteurs de manière progressive.
   * Émet la liste cumulée au fur et à mesure que les fichiers sont chargés.
   */
  getActeursProgressivement(): Observable<Acteur[]> {
    return from(this.FICHIERS_LOTS).pipe(
      mergeMap(file => this.chargerFichier(file), 3), // Charge 3 fichiers en parallèle max
      scan((acc, nouveaux) => [...acc, ...nouveaux], [] as Acteur[]),
      startWith([] as Acteur[])
    );
  }

  private chargerFichier(url: string): Observable<Acteur[]> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(csvData => this.parserCSV(csvData)),
      catchError(() => of([]))
    );
  }

  private parserCSV(csvData: string): Acteur[] {
    if (!csvData) return [];
    const acteurs: Acteur[] = [];
    const lines = csvData.split('\n');
    
    // Skip header
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split('|');
      if (parts.length >= 3) {
        acteurs.push({
          id: parts[0] || '',
          imageProfil: parts[1] || '',
          nom: parts[2] || '',
          professionsListe: parts[3] || '',
          listeIdFilms: parts[4] || '',
          descriptions: parts[5] || ''
        });
      }
    }
    return acteurs;
  }
}
