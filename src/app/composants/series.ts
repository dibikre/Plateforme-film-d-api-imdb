import { Component, inject, OnInit, signal } from '@angular/core';
import { FilmService } from '../services/film';
import { CarteFilm } from './carte-film';
import { MatIconModule } from '@angular/material/icon';
import { ResultatImdb } from '../services/recherche-imdb';
import { Location } from '@angular/common';

@Component({
  selector: 'app-series',
  imports: [CarteFilm, MatIconModule],
  template: `
    <div class="px-8 py-12">
      <header class="mb-12">
        <div class="flex items-center gap-4 mb-4">
          <button (click)="retour()" class="p-2 hover:bg-white/10 rounded-full transition-colors group">
            <mat-icon class="text-zinc-500 group-hover:text-white">arrow_back</mat-icon>
          </button>
          <h1 class="text-4xl font-black uppercase tracking-widest">Séries</h1>
        </div>
        <p class="text-zinc-500 ml-12">Les meilleures séries télévisées du moment.</p>
      </header>

      @if (chargement()) {
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          @for (i of [1,2,3,4,5,6,7,8,9,10,11,12]; track i) {
            <div class="animate-pulse aspect-[2/3] bg-white/5 rounded-2xl"></div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          @for (serie of resultats(); track serie.id) {
            <app-carte-film [film]="serie"></app-carte-film>
          } @empty {
             <div class="col-span-full py-20 text-center text-zinc-500">
              <mat-icon class="!text-6xl mb-4 opacity-20">tv</mat-icon>
              <p>Auce série trouvée.</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class SeriesComposant implements OnInit {
  private serviceFilm = inject(FilmService);
  private location = inject(Location);
  resultats = signal<ResultatImdb[]>([]);
  chargement = signal(true);

  ngOnInit() {
    this.serviceFilm.rechercher('popular series').subscribe(res => {
      this.resultats.set(res);
      this.chargement.set(false);
    });
  }

  retour() {
    this.location.back();
  }
}
