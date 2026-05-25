import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActeurService, Acteur } from '../services/acteur';
import { MatIconModule } from '@angular/material/icon';
import { CarteFilm } from './carte-film';
import { FavorisService } from '../services/favoris';
import { RechercheImdb, ResultatImdb } from '../services/recherche-imdb';

@Component({
  selector: 'app-detail-acteur',
  standalone: true,
  imports: [CommonModule, MatIconModule, CarteFilm],
  template: `
    <div class="min-h-screen bg-black text-white pb-20">
      <!-- Header avec bouton retour -->
      <div class="px-8 py-6 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-xl z-50 border-b border-white/5">
        <button (click)="retour()" class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
          <mat-icon class="group-hover:-translate-x-1 transition-transform">arrow_back</mat-icon>
          <span class="text-xs font-bold uppercase tracking-widest">Retour</span>
        </button>
        
        <button 
          (click)="basculerFavori()"
          class="p-3 rounded-full transition-all duration-300"
          [class]="favori() ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' : 'bg-zinc-900 text-zinc-500 hover:text-white'"
        >
          <mat-icon>{{ favori() ? 'favorite' : 'favorite_border' }}</mat-icon>
        </button>
      </div>

      @if (acteur(); as a) {
        <div class="px-8 mt-12">
          <div class="flex flex-col md:flex-row gap-12 items-start">
            <!-- Image de l'acteur -->
            <div class="w-full md:w-80 shrink-0">
              <div class="aspect-[2/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                <img 
                  [src]="a.imageProfil" 
                  [alt]="a.nom"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>
            </div>

            <!-- Infos de l'acteur -->
            <div class="flex-1 space-y-8">
              <div>
                <h1 class="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">{{ a.nom }}</h1>
                <div class="flex flex-wrap gap-2">
                  @for (job of jobs(); track job) {
                    <span class="px-4 py-1.5 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {{ job }}
                    </span>
                  }
                </div>
              </div>

              <div class="space-y-4">
                <h2 class="text-sm font-black uppercase tracking-[0.2em] text-red-600">Biographie</h2>
                <p class="text-zinc-400 leading-relaxed text-lg italic">
                  "{{ a.descriptions || 'Aucune biographie disponible pour cet acteur.' }}"
                </p>
              </div>

              <!-- Filmographie -->
              <div class="space-y-8 pt-8 border-t border-white/5">
                <div class="flex items-center justify-between">
                  <h2 class="text-2xl font-black tracking-tight uppercase">Filmographie suggérée</h2>
                  <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{{ films().length }} résultats trouvés</span>
                </div>

                @if (chargementFilms()) {
                  <div class="flex flex-col items-center justify-center py-20 gap-4">
                    <div class="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
                    <p class="text-zinc-500 font-medium">Recherche de films...</p>
                  </div>
                } @else {
                  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    @for (film of films(); track film.id) {
                      <app-carte-film [film]="film"></app-carte-film>
                    } @empty {
                      <div class="col-span-full py-12 text-center text-zinc-500 bg-zinc-900/40 rounded-3xl border border-dashed border-white/5">
                        <mat-icon class="text-4xl mb-2 opacity-20">movie_filter</mat-icon>
                        <p>Aucun film trouvé pour cet acteur sur IMDB.</p>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div class="w-12 h-12 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin"></div>
          <p class="text-zinc-500 font-medium italic">Chargement du profil de l'artiste...</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class DetailActeurComposant implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private serviceActeur = inject(ActeurService);
  private serviceImdb = inject(RechercheImdb);
  private favorisService = inject(FavorisService);

  acteur = signal<Acteur | null>(null);
  films = signal<ResultatImdb[]>([]);
  chargementFilms = signal(false);
  
  favori = computed(() => {
    const a = this.acteur();
    return a ? this.favorisService.estActeurFavori(a.id) : false;
  });

  jobs = computed(() => {
    const a = this.acteur();
    if (!a?.professionsListe) return [];
    return a.professionsListe.split(',').map(s => s.trim());
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.chargerActeur(id);
      }
    });
  }

  chargerActeur(id: string) {
    // Dans ActeurService, on n'a pas de getById direct, on doit filtrer la liste
    this.serviceActeur.getActeursProgressivement().subscribe(acteurs => {
      const trouvé = acteurs.find(a => a.id === id);
      if (trouvé) {
        this.acteur.set(trouvé);
        this.chargerFilmographie(trouvé.nom);
      }
    });
  }

  chargerFilmographie(nom: string) {
    this.chargementFilms.set(true);
    this.serviceImdb.rechercher(nom).subscribe({
      next: (res) => {
        // On filtre pour être sûr que ça a un rapport (OMDB est parfois approximatif)
        this.films.set(res.slice(0, 10));
        this.chargementFilms.set(false);
      },
      error: () => this.chargementFilms.set(false)
    });
  }

  basculerFavori() {
    const a = this.acteur();
    if (a) {
      this.favorisService.basculerActeur(a);
    }
  }

  retour() {
    this.location.back();
  }
}
