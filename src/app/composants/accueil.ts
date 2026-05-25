import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { FilmService } from '../services/film';
import { CarteFilm } from './carte-film';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Youtube } from '../services/youtube';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-accueil',
  imports: [CarteFilm, MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0502] text-white">
      
      <!-- Section Héros (Façon Netflix) -->
      @if (serviceFilm.vedette(); as v) {
        <div 
          class="relative h-[85vh] w-full overflow-hidden rounded-bl-[10px] rounded-br-[10px]"
          style="margin-bottom: 100px;"
        >
          <!-- Image de fond / Video -->
          <div class="absolute inset-0">
            @if (videoUrl()) {
              <div class="absolute inset-0 w-full h-full pointer-events-none">
                <iframe 
                  [src]="videoUrl()" 
                  class="absolute top-1/2 left-1/2 w-[300%] h-[300%] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-60 pointer-events-none scale-105"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            }
            
            @if (v.i?.imageUrl && !videoUrl()) {
              <img [src]="v.i?.imageUrl" class="w-full h-full object-cover opacity-60 scale-105" [alt]="v.l" referrerpolicy="no-referrer">
            } @else if (!videoUrl()) {
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
          <div 
            class="relative z-10 h-full px-12 md:px-20 max-w-full flex flex-col justify-start pt-32 md:pt-48"
          >
            <!-- Badge et Rating ABOVE Title -->
            <div 
              class="flex items-center gap-4 text-sm font-bold mb-8"
            >
              <span class="bg-red-600 text-white px-2 py-0.5 text-[10px] md:text-xs font-black rounded-sm uppercase tracking-tighter">N SERIES</span>
              <span class="text-amber-400 flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                <mat-icon class="scale-75">star</mat-icon>
                IMDb {{ v.rank ? (10 - v.rank/100).toFixed(1) : '8.8' }}/10
              </span>
              <span class="hidden md:inline text-zinc-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">2B+ Streams</span>
            </div>

            <!-- Titre -->
            <div class="mb-12">
              <h1 
                class="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight uppercase max-w-3xl"
              >
                {{ v.l }}
              </h1>
            </div>

            <!-- Groupe Boutons -->
            <div class="absolute bottom-8 left-6 md:left-20 flex flex-wrap items-center gap-3 md:gap-4 z-20 pr-6">
              @if (videoId()) {
                <button [routerLink]="['/lecture', videoId()]" [queryParams]="{ titre: v.l }" class="bg-red-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-md text-sm md:text-base font-bold flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-900/40">
                  <mat-icon>play_arrow</mat-icon>
                  Lecture
                </button>
              } @else {
                <button [routerLink]="['/film', v.id]" class="bg-red-600 text-white px-6 py-3 md:px-10 md:py-4 rounded-md text-sm md:text-base font-bold flex items-center gap-2 hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-900/40">
                  <mat-icon>play_arrow</mat-icon>
                  Lecture
                </button>
              }
              <button [routerLink]="['/film', v.id]" class="bg-white/10 backdrop-blur-md text-white px-5 py-3 md:px-8 md:py-4 rounded-md text-sm md:text-base font-bold flex items-center gap-2 hover:bg-white/20 transition-all border border-white/10">
                <mat-icon>info_outline</mat-icon>
                Bande-annonce
              </button>
            </div>
          </div>
        </div>
      }

      <div 
        class="relative z-20 px-8 space-y-16 pb-20"
        style="margin-top: 24px;"
      >
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
  youtube = inject(Youtube);
  sanitizer = inject(DomSanitizer);

  videoId = signal<string | null>(null);
  videoUrl = signal<SafeResourceUrl | null>(null);

  constructor() {
    effect(() => {
      const v = this.serviceFilm.vedette();
      if (v) {
        this.youtube.recupererBandeAnnonce(v.l).subscribe(res => {
          if (res) {
            this.videoId.set(res.videoId);
            this.videoUrl.set(
              this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.youtube.com/embed/${res.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${res.videoId}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`
              )
            );
          }
        });
      }
    });
  }

  ngOnInit() {
    if (this.serviceFilm.filmsPopulaires().length === 0) {
      this.serviceFilm.initialiser();
    } else {
      this.serviceFilm.choisirVedetteAleatoire();
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
