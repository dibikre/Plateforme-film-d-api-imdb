import { Component, inject, OnInit } from '@angular/core';
import { FilmService } from '../services/film';
import { CarteFilm } from './carte-film';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-accueil',
  imports: [CarteFilm, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0502] text-white">
      
      <!-- Section Héros (Façon Netflix) -->
      @if (serviceFilm.vedette(); as v) {
        <div class="relative h-[85vh] w-full overflow-hidden">
          <!-- Image de fond -->
          <div class="absolute inset-0">
            @if (v.i?.imageUrl) {
              <img [src]="v.i?.imageUrl" class="w-full h-full object-cover opacity-60 scale-105" [alt]="v.l" referrerpolicy="no-referrer">
            } @else {
              <div class="w-full h-full bg-gradient-to-br from-zinc-900 to-black relative">
                <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 5px 5px, #fff 1px, transparent 0); background-size: 50px 50px;"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <mat-icon class="!text-[200px] text-white/5 font-thin transform -rotate-12">movie_filter</mat-icon>
                </div>
              </div>
            }
            <div class="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-transparent to-transparent"></div>
          </div>

          <!-- Contenu Héros -->
          <div class="relative z-10 h-full flex flex-col justify-center px-12 md:px-20 max-w-full pt-20">
            <div class="flex items-center gap-2 mb-4">
              <span class="bg-red-600 text-white px-2 py-0.5 text-xs font-black rounded-sm uppercase tracking-tighter">N SERIES</span>
            </div>
            <h1 
              class="text-6xl md:text-8xl font-black mb-4 leading-none tracking-widest uppercase"
              style="width: 1000px; padding-top: 0px;"
            >
              {{ v.l }}
            </h1>
            
            <div class="flex items-center gap-4 mb-8 text-sm font-bold">
              <span class="text-amber-400 flex items-center gap-1">
                <mat-icon class="scale-75">star</mat-icon>
                IMDb {{ v.rank ? (10 - v.rank/100).toFixed(1) : '8.8' }}/10
              </span>
              <span class="text-zinc-400">2B+ Streams</span>
            </div>

            <div class="flex items-center gap-4">
              <button [routerLink]="['/film', v.id]" class="bg-red-600 text-white px-10 py-3 rounded-md font-bold flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-900/20">
                <mat-icon>play_arrow</mat-icon>
                Lecture
              </button>
              <button [routerLink]="['/film', v.id]" class="bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-md font-bold flex items-center gap-2 hover:bg-white/30 transition-all">
                <mat-icon>info_outline</mat-icon>
                Bande-annonce
              </button>
            </div>
          </div>
        </div>
      }

      <div class="relative z-20 px-8 -mt-20 space-y-16 pb-20">
        <!-- Section Films -->
        <section class="group/row relative">
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            Films Populaires
          </h2>
          
          <div class="relative">
            <!-- Flèches directionnelles -->
            <button 
              (click)="faireDefiler(filmsScroll, 'gauche')"
              class="absolute -left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-red-600"
            >
              <mat-icon>chevron_left</mat-icon>
            </button>

            <div #filmsScroll class="flex overflow-x-auto gap-4 pb-6 no-scrollbar scroll-smooth">
              @for (film of serviceFilm.filmsPopulaires(); track film.id) {
                <div class="min-w-[200px] md:min-w-[240px]">
                  <app-carte-film [film]="film"></app-carte-film>
                </div>
              }
            </div>

            <button 
              (click)="faireDefiler(filmsScroll, 'droite')"
              class="absolute -right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-red-600"
            >
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
        </section>

        <!-- Section Séries -->
        <section class="group/row relative">
          <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
            Séries à Voir
          </h2>
          
          <div class="relative">
            <button 
              (click)="faireDefiler(seriesScroll, 'gauche')"
              class="absolute -left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-red-600"
            >
              <mat-icon>chevron_left</mat-icon>
            </button>

            <div #seriesScroll class="flex overflow-x-auto gap-4 pb-6 no-scrollbar scroll-smooth">
              @for (serie of serviceFilm.seriesPopulaires(); track serie.id) {
                <div class="min-w-[200px] md:min-w-[240px]">
                  <app-carte-film [film]="serie"></app-carte-film>
                </div>
              }
            </div>

            <button 
              (click)="faireDefiler(seriesScroll, 'droite')"
              class="absolute -right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/50 backdrop-blur-xl border border-white/10 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-red-600"
            >
              <mat-icon>chevron_right</mat-icon>
            </button>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class Accueil implements OnInit {
  serviceFilm = inject(FilmService);
  router = inject(Router);

  ngOnInit() {
    if (this.serviceFilm.filmsPopulaires().length === 0) {
      this.serviceFilm.initialiser();
    }
  }

  faireDefiler(el: HTMLDivElement, direction: 'gauche' | 'droite') {
    const quantite = direction === 'gauche' ? -500 : 500;
    el.scrollBy({ left: quantite, behavior: 'smooth' });
  }

  versRecherche(requete: string) {
    this.router.navigate(['/recherche'], { queryParams: { q: requete } });
  }
}
