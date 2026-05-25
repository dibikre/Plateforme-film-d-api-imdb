import { Component, input, inject } from '@angular/core';
import { ResultatImdb } from '../services/recherche-imdb';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FavorisService } from '../services/favoris';

@Component({
  selector: 'app-carte-film',
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="relative group">
      <a [routerLink]="['/film', film().id]" 
         class="block aspect-[2/3] overflow-hidden rounded-2xl bg-zinc-900 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-red-600/20 active:scale-95">
        
        <!-- Image du poster -->
        @if (film().i?.imageUrl) {
          <img 
            [src]="film().i?.imageUrl" 
            [alt]="film().l"
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerpolicy="no-referrer"
          />
        } @else {
          <div class="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-800 to-black relative overflow-hidden">
            <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 2px 2px, #fff 1px, transparent 0); background-size: 24px 24px;"></div>
            <mat-icon class="mb-4 !text-5xl text-red-600/30 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700">movie_filter</mat-icon>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 line-clamp-3 px-4">{{ film().l }}</span>
            <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-red-600/5 rounded-full blur-2xl"></div>
          </div>
        }

        <!-- Overlay au survol -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div class="absolute bottom-0 left-0 right-0 p-4">
            <h3 class="line-clamp-2 text-lg font-bold text-white">{{ film().l }}</h3>
            <div class="mt-1 flex items-center gap-2 text-xs text-amber-400">
              <span>{{ film().y || film().yr }}</span>
              @if (film().q) {
                <span class="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase text-white">{{ film().q }}</span>
              }
            </div>
          </div>
        </div>

        <!-- Badge de rang ou type (optionnel) -->
        @if (film().rank) {
          <div class="absolute right-3 top-3 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-lg">
            #{{ film().rank }}
          </div>
        }
      </a>

      <!-- Bouton Favori -->
      <button 
        (click)="basculerFavori($event)"
        class="absolute left-3 top-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all hover:scale-110 active:scale-90 hover:bg-red-600 group/fav"
        [class.text-red-500]="estFavori()"
      >
        <mat-icon class="!text-xl overflow-visible">{{ estFavori() ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CarteFilm {
  film = input.required<ResultatImdb>();
  private serviceFavoris = inject(FavorisService);

  estFavori(): boolean {
    return this.serviceFavoris.estFilmFavori(this.film().id);
  }

  basculerFavori(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.serviceFavoris.basculerFilm(this.film());
  }
}
