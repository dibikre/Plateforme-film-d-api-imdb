import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FilmService } from '../services/film';
import { CarteFilm } from './carte-film';
import { MatIconModule } from '@angular/material/icon';
import { ResultatImdb } from '../services/recherche-imdb';
import { Location, CommonModule } from '@angular/common';

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [CarteFilm, MatIconModule, CommonModule],
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
          @for (serie of resultatsAffiches(); track serie.id) {
            <app-carte-film [film]="serie"></app-carte-film>
          } @empty {
             <div class="col-span-full py-20 text-center text-zinc-500">
              <mat-icon class="!text-6xl mb-4 opacity-20">tv</mat-icon>
              <p>Aucune série trouvée.</p>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (resultatsTotaux().length > taillePage) {
          <div class="flex items-center justify-center gap-4 mt-12 mb-20">
            <button 
              (click)="pagePrecedente()"
              [disabled]="page() === 1"
              class="p-4 rounded-full bg-zinc-900 border border-white/5 disabled:opacity-30 hover:bg-red-600 transition-colors group"
            >
              <mat-icon class="group-hover:scale-110 transition-transform">chevron_left</mat-icon>
            </button>
            
            <div class="flex items-center gap-2">
              <span class="text-zinc-500 text-sm font-bold uppercase tracking-widest">Page</span>
              <input 
                type="number"
                [value]="page()"
                (change)="allerAPage($event)"
                (keyup.enter)="allerAPage($event)"
                min="1"
                [max]="totalPages()"
                class="w-16 text-center text-xl font-black text-white px-2 py-2 bg-zinc-900 rounded-lg border border-white/10 shadow-xl focus:border-red-600 focus:ring-0 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              >
              <span class="text-zinc-500 text-sm font-bold uppercase tracking-widest">sur {{ totalPages() }}</span>
            </div>

            <button 
              (click)="pageSuivante()"
              [disabled]="page() === totalPages()"
              class="p-4 rounded-full bg-zinc-900 border border-white/5 disabled:opacity-30 hover:bg-red-600 transition-colors group"
            >
              <mat-icon class="group-hover:scale-110 transition-transform">chevron_right</mat-icon>
            </button>
          </div>
        }
      }
    </div>
  `
})
export class SeriesComposant implements OnInit {
  private serviceFilm = inject(FilmService);
  private location = inject(Location);
  
  resultatsTotaux = signal<ResultatImdb[]>([]);
  chargement = signal(true);
  page = signal(1);
  taillePage = 30;

  resultatsAffiches = computed(() => {
    const debut = (this.page() - 1) * this.taillePage;
    return this.resultatsTotaux().slice(debut, debut + this.taillePage);
  });

  totalPages = computed(() => Math.ceil(this.resultatsTotaux().length / this.taillePage) || 1);

  ngOnInit() {
    if (this.serviceFilm.seriesPopulaires().length === 0) {
      this.serviceFilm.initialiser();
    }
    
    this.resultatsTotaux = this.serviceFilm.seriesPopulaires;
    this.chargement = this.serviceFilm.chargement;
  }

  allerAPage(event: Event) {
    const target = event.target as HTMLInputElement;
    const nouvellePage = parseInt(target.value, 10);
    if (!isNaN(nouvellePage) && nouvellePage >= 1 && nouvellePage <= this.totalPages()) {
      this.page.set(nouvellePage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      target.value = this.page().toString();
    }
  }

  pageSuivante() {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  pagePrecedente() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  retour() {
    this.location.back();
  }
}
