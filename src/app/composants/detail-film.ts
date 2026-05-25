import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FilmService, DetailFilm } from '../services/film';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { FavorisService } from '../services/favoris';

@Component({
  selector: 'app-detail-film',
  standalone: true,
  imports: [MatIconModule, CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0502] text-white">
      <!-- Bouton retour flottant -->
      <div class="fixed left-8 top-8 z-50 flex items-center gap-4" style="margin-left: 64px;">
        <button 
          (click)="retour()" 
          class="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-red-600 transition-all shadow-2xl group"
        >
          <mat-icon class="group-hover:scale-110 transition-transform">arrow_back</mat-icon>
        </button>

        @if (film()) {
          <button 
            (click)="basculerFavori()" 
            class="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all shadow-2xl group"
            [class.text-red-500]="favori()"
          >
            <mat-icon class="group-hover:scale-110 transition-transform text-xl">
              {{ favori() ? 'favorite' : 'favorite_border' }}
            </mat-icon>
          </button>
        }
      </div>

      @if (chargement()) {
        <div class="flex flex-col items-center justify-center h-screen gap-4">
          <div class="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-red-600 font-medium animate-pulse text-lg">Chargement de l'univers cinématographique...</p>
        </div>
      } @else if (film(); as f) {
        <!-- Bannière Héros / Background -->
        <div class="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
          <div class="absolute inset-0 z-0">
            @if (f.i?.imageUrl) {
              <img [src]="f.i?.imageUrl" class="w-full h-full object-cover blur-sm opacity-30 scale-110" [alt]="f.l" referrerpolicy="no-referrer">
            }
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0502]/80 to-[#0a0502]"></div>
          </div>

          <!-- Contenu Héros -->
          <div class="relative z-10 h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-12">
            <div class="flex flex-col md:flex-row gap-8 items-end md:items-start">
              <!-- Poster -->
              <div class="hidden md:block w-64 shrink-0 shadow-2xl rounded-2xl overflow-hidden border border-white/10 translate-y-32">
                @if (f.i?.imageUrl) {
                  <img [src]="f.i?.imageUrl" class="w-full aspect-[2/3] object-cover" [alt]="f.l" referrerpolicy="no-referrer">
                } @else {
                  <div class="w-full aspect-[2/3] bg-gradient-to-br from-zinc-900 to-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                    <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 2px 2px, #fff 1px, transparent 0); background-size: 32px 32px;"></div>
                    <mat-icon class="!text-7xl text-red-600/20 mb-6 transform -rotate-12">movie_filter</mat-icon>
                    <p class="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 leading-relaxed">{{ f.l }}</p>
                    <div class="mt-6 w-12 h-1 bg-red-600/20 rounded-full"></div>
                    <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl"></div>
                  </div>
                }
              </div>

              <!-- Infos principales -->
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  @if (f.q) {
                    <span class="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{{ f.q }}</span>
                  }
                  <span class="text-zinc-400 font-medium">{{ f.y || f.yr }}</span>
                  @if (f.rank) {
                    <span class="bg-amber-500 text-black px-2 py-0.5 rounded text-[10px] font-black italic">IMDb #{{ f.rank }}</span>
                  }
                </div>
                <h1 class="text-4xl md:text-7xl font-black mb-6 leading-none tracking-widest uppercase">{{ f.l }}</h1>
                
                <div class="flex flex-wrap gap-4 mb-8">
                  @if (f.s) {
                    <div class="flex flex-col">
                      <span class="text-[10px] uppercase text-zinc-500 font-bold tracking-widest mb-1">Casting Principal</span>
                      <span class="text-zinc-300 font-medium">{{ f.s }}</span>
                    </div>
                  }
                </div>

                <div class="flex items-center gap-4">
                   <button (click)="scrollToTrailer()" class="bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5">
                    <mat-icon>play_circle</mat-icon>
                    Bande-annonce
                  </button>
                  <a [href]="'https://www.imdb.com/title/' + f.id" target="_blank" class="bg-zinc-800/80 hover:bg-zinc-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 backdrop-blur-md transition-all">
                    <mat-icon>open_in_new</mat-icon>
                    IMDb
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Détails additionnels -->
        <div class="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-20">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <!-- Synopsis & Trailer -->
            <div class="lg:col-span-2 space-y-12">
              <div id="trailer-section" class="scroll-mt-24">
                <h2 class="text-2xl font-bold mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-4">
                  Bande-annonce officielle
                </h2>
                @if (urlBandeAnnonce()) {
                  <div class="aspect-video w-full rounded-3xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                    <iframe 
                      [src]="urlBandeAnnonce()" 
                      class="w-full h-full" 
                      frameborder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen>
                    </iframe>
                  </div>
                } @else {
                  <div class="aspect-video w-full rounded-3xl bg-zinc-900/50 flex flex-col items-center justify-center border-2 border-dashed border-white/5">
                    <mat-icon class="!text-5xl text-zinc-800 mb-4 font-thin">video_camera_back</mat-icon>
                    <p class="text-zinc-500">Bande-annonce non disponible pour ce titre.</p>
                  </div>
                }
              </div>

              <div>
                <h2 class="text-2xl font-bold mb-6 flex items-center gap-2 border-l-4 border-red-600 pl-4">
                  Synopsis
                </h2>
                <p class="text-xl text-zinc-400 leading-relaxed font-light mb-6">
                  Découvrez l'expérience complète de {{ f.l }}. @if(f.s) { Avec la participation exceptionnelle de {{ f.s }}. } Explorez cet univers fascinant qui a captivé les audiences lors de sa sortie en {{ f.yr || f.y }}.
                </p>

                @if (f.youtubeDescription) {
                  <div class="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 class="text-red-600 font-bold mb-3 flex items-center gap-2">
                       <mat-icon class="!text-sm">details</mat-icon>
                       Détails de la vidéo (via YouTube)
                    </h3>
                    <p class="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-red-600/20">
                      {{ f.youtubeDescription }}
                    </p>
                  </div>
                }
              </div>
            </div>

            <!-- Colonne de droite / Sidebar -->
            <div class="space-y-8">
              <div class="bg-white/5 rounded-3xl p-8 backdrop-blur-xl border border-white/10">
                <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-red-600 mb-6">Fiche Technique</h3>
                <dl class="space-y-6">
                  <div>
                    <dt class="text-[10px] uppercase text-zinc-500 font-bold mb-1 tracking-wider">Identifiant</dt>
                    <dd class="text-zinc-200 font-mono text-sm">{{ f.id }}</dd>
                  </div>
                  <div>
                    <dt class="text-[10px] uppercase text-zinc-500 font-bold mb-1 tracking-wider">Type</dt>
                    <dd class="text-zinc-200 capitalize">{{ f.q || 'Inconnu' }}</dd>
                  </div>
                  <div>
                    <dt class="text-[10px] uppercase text-zinc-500 font-bold mb-1 tracking-wider">Année</dt>
                    <dd class="text-zinc-200">{{ f.yr || f.y }}</dd>
                  </div>
                  @if (f.s) {
                    <div>
                      <dt class="text-[10px] uppercase text-zinc-500 font-bold mb-1 tracking-wider">Casting</dt>
                      <dd class="text-zinc-300 text-sm italic">{{ f.s }}</dd>
                    </div>
                  }
                </dl>
              </div>

              <div class="bg-red-600/10 rounded-3xl p-8 border border-red-600/20">
                <p class="text-center font-medium" [class.text-red-500]="favori()">
                  {{ favori() ? 'Fait partie de vos favoris' : 'Prêt pour la séance ?' }}
                </p>
                <button 
                  (click)="basculerFavori()"
                  class="w-full mt-4 font-bold py-3 rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  [class]="favori() ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-red-600 text-white hover:bg-red-700'"
                >
                  <mat-icon>{{ favori() ? 'favorite_border' : 'favorite' }}</mat-icon>
                  {{ favori() ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
                </button>
              </div>

              <!-- Recommandations verticales -->
              @if (filmsRecommandes().length > 0) {
                <div class="space-y-6 pt-4">
                  <h3 class="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 pl-2">Recommandations</h3>
                  <div class="space-y-4">
                    @for (rec of filmsRecommandes(); track rec.id) {
                      <a 
                        [routerLink]="['/film', rec.id]" 
                        class="flex gap-4 p-3 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 hover:border-red-600/30 transition-all duration-300 group cursor-pointer outline-none focus:ring-2 focus:ring-red-600"
                      >
                        <div class="w-16 aspect-[2/3] rounded-lg bg-zinc-950 border border-white/5 overflow-hidden shrink-0 relative shadow-md">
                          @if (rec.i?.imageUrl) {
                            <img 
                              [src]="rec.i?.imageUrl" 
                              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                              [alt]="rec.l" 
                              referrerpolicy="no-referrer"
                            >
                          } @else {
                            <div class="w-full h-full flex items-center justify-center bg-zinc-900">
                              <mat-icon class="text-zinc-700 text-sm">movie</mat-icon>
                            </div>
                          }
                        </div>
                        <div class="flex flex-col justify-center min-w-0 pr-2">
                          <h4 class="text-sm font-bold tracking-tight line-clamp-2 uppercase group-hover:text-red-500 transition-colors">
                            {{ rec.l }}
                          </h4>
                          <p class="text-[10px] text-zinc-500 mt-1 uppercase font-semibold">
                            {{ rec.y || rec.yr || 'CinéMic' }} @if (rec.q) { • {{ rec.q }} }
                          </p>
                        </div>
                      </a>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <mat-icon class="!text-7xl text-zinc-800 mb-6">error_outline</mat-icon>
          <h2 class="text-3xl font-bold mb-4">Oups ! Film introuvable</h2>
          <p class="text-zinc-500 mb-8 max-w-md">Nous ne parvenons pas à charger les détails de ce film. Il a peut-être été retiré ou le lien est incorrect.</p>
          <button routerLink="/" class="bg-red-600 text-white px-8 py-3 rounded-full font-bold">Retourner explorer</button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    iframe {
      border: 0;
    }
  `]
})
export class DetailFilmComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private serviceFilm = inject(FilmService);
  private sanitizer = inject(DomSanitizer);
  private location = inject(Location);
  private favorisService = inject(FavorisService);

  film = signal<DetailFilm | null>(null);
  chargement = signal<boolean>(true);
  urlBandeAnnonce = signal<SafeResourceUrl | null>(null);

  favori = computed(() => {
    const f = this.film();
    return f ? this.favorisService.estFilmFavori(f.id) : false;
  });

  filmsRecommandes = computed(() => {
    const f = this.film();
    const list = this.serviceFilm.filmsPopulaires();
    if (list.length === 0) return [];
    const filter = f ? list.filter(item => item.id !== f.id) : list;
    return filter.slice(0, 5);
  });

  ngOnInit() {
    this.serviceFilm.initialiser();
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.chargerFilm(id);
      }
    });
  }

  basculerFavori() {
    const f = this.film();
    if (f) {
      this.favorisService.basculerFilm(f);
    }
  }

  retour() {
    this.location.back();
  }

  chargerFilm(id: string) {
    this.chargement.set(true);
    this.serviceFilm.recupererDetailComplet(id).subscribe({
      next: (f) => {
        this.film.set(f);
        if (f?.videoId) {
          const url = `https://www.youtube.com/embed/${f.videoId}?autoplay=1&mute=0&rel=0&enablejsapi=1`;
          this.urlBandeAnnonce.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
        }
        this.chargement.set(false);
      },
      error: () => {
        this.chargement.set(false);
      }
    });
  }

  scrollToTrailer() {
    const el = document.getElementById('trailer-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
