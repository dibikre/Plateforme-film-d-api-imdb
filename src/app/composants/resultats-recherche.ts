import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmService } from '../services/film';
import { ResultatImdb } from '../services/recherche-imdb';
import { BarreRecherche } from './barre-recherche';
import { CarteFilm } from './carte-film';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-resultats-recherche',
  imports: [BarreRecherche, CarteFilm, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#0a0502] text-white">
      <!-- Arrière-plan atmosphérique -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div class="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-900/10 blur-[120px]"></div>
      </div>

      <div class="relative z-10 px-4 py-8 md:px-8 max-w-7xl mx-auto">
        <!-- Bouton retour -->
        <button (click)="retour()" class="mb-10 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-red-600 transition-all shadow-2xl group">
          <mat-icon class="group-hover:scale-110 transition-transform">arrow_back</mat-icon>
        </button>

        <header class="mb-12">
          <h1 class="text-3xl md:text-5xl font-black mb-8 uppercase tracking-widest text-zinc-300">Résultats pour "<span class="text-red-600 italic tracking-normal">{{ requete() }}</span>"</h1>
          <app-barre-recherche (recherche)="rechercher($event)"></app-barre-recherche>
        </header>

        @if (enChargement()) {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            @for (i of [1,2,3,4,5,6,7,8,9,10]; track i) {
              <div class="animate-pulse aspect-[2/3] bg-white/5 rounded-2xl"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            @for (film of resultats(); track film.id) {
              <app-carte-film [film]="film"></app-carte-film>
            } @empty {
              <div class="col-span-full py-32 text-center">
                <mat-icon class="!text-8xl text-zinc-800 mb-6 font-thin">search_off</mat-icon>
                <h3 class="text-2xl font-semibold mb-2">Aucun résultat trouvé</h3>
                <p class="text-zinc-500">Essayez avec d'autres mots-clés ou vérifiez l'orthographe.</p>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ResultatsRecherche implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private serviceFilm = inject(FilmService);
  private location = inject(Location);

  requete = signal<string>('');
  resultats = signal<ResultatImdb[]>([]);
  enChargement = signal<boolean>(false);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.rechercher(q);
      }
    });
  }

  rechercher(q: string) {
    this.requete.set(q);
    this.enChargement.set(true);
    this.serviceFilm.rechercher(q).subscribe({
      next: (res) => {
        this.resultats.set(res);
        this.enChargement.set(false);
      },
      error: () => {
        this.resultats.set([]);
        this.enChargement.set(false);
      }
    });
  }

  retour() {
    this.location.back();
  }
}
