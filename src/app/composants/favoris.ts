import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, Router } from '@angular/router';
import { FavorisService } from '../services/favoris';
import { CarteFilm } from './carte-film';
import { Location, CommonModule } from '@angular/common';

import { Acteur } from '../services/acteur';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [MatIconModule, RouterLink, CarteFilm, CommonModule],
  template: `
    <div class="px-8 py-12 min-h-screen flex flex-col">
      <header class="mb-12">
        <div class="flex items-center gap-4 mb-4">
          <button (click)="retour()" class="p-2 hover:bg-white/10 rounded-full transition-colors group">
            <mat-icon class="text-zinc-500 group-hover:text-white">arrow_back</mat-icon>
          </button>
          <h1 class="text-4xl font-black uppercase tracking-widest">Mes Favoris</h1>
        </div>
        <p class="text-zinc-500 ml-12">Retrouvez ici tous les films, séries et acteurs que vous avez aimés.</p>
      </header>

      @if (listeFilms().length > 0 || listeActeurs().length > 0) {
        <div class="space-y-16">
          <!-- Section Films/Séries -->
          @if (listeFilms().length > 0) {
            <section>
              <h2 class="text-xl font-bold mb-8 flex items-center gap-3 border-l-4 border-red-600 pl-4 uppercase tracking-wider">
                Films & Séries ({{ listeFilms().length }})
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                @for (film of listeFilms(); track film.id) {
                  <app-carte-film [film]="film"></app-carte-film>
                }
              </div>
            </section>
          }

          <!-- Section Acteurs -->
          @if (listeActeurs().length > 0) {
            <section>
              <h2 class="text-xl font-bold mb-8 flex items-center gap-3 border-l-4 border-blue-600 pl-4 uppercase tracking-wider">
                Acteurs ({{ listeActeurs().length }})
              </h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                @for (acteur of listeActeurs(); track acteur.id) {
                  <div 
                    (click)="voirActeur(acteur.id)"
                    (keydown.enter)="voirActeur(acteur.id)"
                    tabindex="0"
                    class="group relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-blue-600/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <div class="aspect-[2/3] overflow-hidden relative">
                      <img 
                        [src]="acteur.imageProfil" 
                        [alt]="acteur.nom"
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerpolicy="no-referrer"
                      >
                      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      
                      <button 
                        (click)="retirerActeur($event, acteur)"
                        class="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-red-500 transition-all hover:scale-110"
                      >
                        <mat-icon class="text-sm">favorite</mat-icon>
                      </button>
                    </div>
                    <div class="p-4">
                      <h3 class="font-black text-sm uppercase group-hover:text-blue-500 transition-colors">{{ acteur.nom }}</h3>
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        </div>
      } @else {
        <div class="flex-1 flex flex-col items-center justify-center text-center">
          <div class="mb-8 relative">
             <mat-icon class="!text-[120px] !w-[120px] !h-[120px] text-zinc-800 font-thin">bookmark_border</mat-icon>
             <div class="absolute -top-2 -right-2 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center animate-bounce">
               <mat-icon class="!text-sm text-white">favorite</mat-icon>
             </div>
          </div>
          <h3 class="text-2xl font-bold mb-4 uppercase tracking-wider">Votre liste est vide</h3>
          <p class="text-zinc-500 max-w-sm mb-10 leading-relaxed italic">
            Commencez à explorer notre catalogue et cliquez sur le bouton favori pour ajouter des titres et des personnalités à votre collection.
          </p>
          <button routerLink="/" class="bg-red-600 text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all hover:scale-110 active:scale-95 shadow-2xl shadow-red-900/40">
            Découvrir maintenant
          </button>
        </div>
      }
    </div>
  `
})
export class FavorisComposant {
  private serviceFavoris = inject(FavorisService);
  private location = inject(Location);
  private router = inject(Router);

  listeFilms = this.serviceFavoris.recupererFilms();
  listeActeurs = this.serviceFavoris.recupererActeurs();

  retour() {
    this.location.back();
  }

  voirActeur(id: string) {
    this.router.navigate(['/acteur', id]);
  }

  retirerActeur(event: Event, acteur: Acteur) {
    event.stopPropagation();
    this.serviceFavoris.basculerActeur(acteur);
  }
}
