import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FavorisService } from '../services/favoris';
import { CarteFilm } from './carte-film';
import { Location } from '@angular/common';

@Component({
  selector: 'app-favoris',
  imports: [MatIconModule, RouterLink, CarteFilm],
  template: `
    <div class="px-8 py-12 min-h-screen flex flex-col">
      <header class="mb-12">
        <div class="flex items-center gap-4 mb-4">
          <button (click)="retour()" class="p-2 hover:bg-white/10 rounded-full transition-colors group">
            <mat-icon class="text-zinc-500 group-hover:text-white">arrow_back</mat-icon>
          </button>
          <h1 class="text-4xl font-black uppercase tracking-widest">Mes Favoris</h1>
        </div>
        <p class="text-zinc-500 ml-12">Retrouvez ici tous les films et séries que vous avez aimés.</p>
      </header>

      @if (listeFavoris().length > 0) {
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          @for (film of listeFavoris(); track film.id) {
            <app-carte-film [film]="film"></app-carte-film>
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
            Commencez à explorer notre catalogue et cliquez sur le bouton favori pour ajouter des titres à votre collection personnelle.
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
  listeFavoris = this.serviceFavoris.recupererListeFavoris();

  retour() {
    this.location.back();
  }
}
