import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { FilmService } from '../services/film';

@Component({
  selector: 'app-lecture-video',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] text-white flex flex-col">
      <header class="p-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-[60]">
        <div class="flex items-center gap-6">
          <button (click)="retour()" class="p-2 hover:bg-white/10 rounded-full transition-colors group">
            <mat-icon class="text-zinc-500 group-hover:text-white">arrow_back</mat-icon>
          </button>
          <div>
            <h1 class="text-xl font-bold tracking-widest line-clamp-1 italic">{{ titre() }}</h1>
            <p class="text-xs text-zinc-500 uppercase tracking-widest font-black">Lecteur CinéMic</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
           <button class="bg-red-600 px-6 py-2 rounded-full text-sm font-bold hover:bg-red-700 transition-colors">Partager</button>
        </div>
      </header>

      <main class="flex-1 flex flex-col lg:flex-row gap-8 p-4 md:p-8 max-w-screen-2xl mx-auto w-full">
        <!-- Lecteur Principal -->
        <div class="flex-1">
          <div class="aspect-video w-full rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5 relative group">
             @if (videoUrl()) {
               <iframe 
                 [src]="videoUrl()" 
                 class="w-full h-full" 
                 frameborder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowfullscreen>
               </iframe>
             } @else {
               <div class="absolute inset-0 flex flex-col items-center justify-center text-zinc-600">
                  <mat-icon class="!text-6xl mb-4">video_library</mat-icon>
                  <p>Chargement de la bande-annonce...</p>
               </div>
             }
          </div>

          <div class="mt-8 space-y-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 class="text-3xl font-black uppercase tracking-tighter">{{ titre() }}</h2>
              <div class="flex items-center gap-2">
                 <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <mat-icon>favorite_border</mat-icon>
                    <span>J'aime</span>
                 </button>
                 <button class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <mat-icon>playlist_add</mat-icon>
                    <span>Enregistrer</span>
                 </button>
              </div>
            </div>

            <div class="p-6 bg-white/5 rounded-2xl border border-white/10">
               <div class="flex items-center gap-4 mb-4">
                  <div class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">C</div>
                  <div>
                    <p class="font-bold">CinéMic Trailers</p>
                    <p class="text-xs text-zinc-500">Officiel • 1.2M abonnés</p>
                  </div>
                  <button class="ml-auto bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold">S'abonner</button>
               </div>
               <p class="text-zinc-400 text-sm leading-relaxed">
                 Regardez la bande-annonce officielle de {{ titre() }}. Restez à l'écoute pour plus de mises à jour sur les sorties de 2026. 
                 Abonnez-vous pour ne rien manquer des dernières actus ciné !
               </p>
            </div>
          </div>
        </div>

        <!-- Sidebar / Suggestions Dynamiques -->
        <aside class="w-full lg:w-96 space-y-6">
           <h3 class="text-sm font-black uppercase tracking-widest text-zinc-500">À suivre</h3>
           <div class="space-y-4">
              @for (film of filmsSuggestions(); track film.id) {
                <div [routerLink]="['/film', film.id]" class="flex gap-4 group cursor-pointer active:scale-95 transition-transform duration-200">
                    <div class="w-40 aspect-video rounded-xl bg-zinc-900 border border-white/5 overflow-hidden shrink-0 relative">
                       @if (film.i?.imageUrl) {
                         <img [src]="film.i?.imageUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" [alt]="film.l" referrerpolicy="no-referrer">
                       } @else {
                         <div class="w-full h-full bg-gradient-to-br from-zinc-850 to-zinc-950 flex items-center justify-center">
                           <mat-icon class="text-zinc-700">movie</mat-icon>
                         </div>
                       }
                    </div>
                    <div class="flex flex-col justify-center">
                       <h4 class="text-sm font-bold line-clamp-2 group-hover:text-red-500 transition-colors">{{ film.l }}</h4>
                       <p class="text-[10px] text-zinc-500 mt-1 uppercase font-bold">{{ film.y || film.yr || 'CinéMic' }} • {{ film.q || 'Film' }}</p>
                    </div>
                </div>
              } @empty {
                @for (i of [1,2,3,4,5]; track i) {
                  <div class="flex gap-4 group animate-pulse">
                     <div class="w-40 aspect-video rounded-xl bg-zinc-900 border border-white/5 overflow-hidden shrink-0">
                        <div class="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900"></div>
                     </div>
                     <div class="flex flex-col justify-center w-full">
                        <div class="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
                        <div class="h-3 bg-zinc-800 rounded w-1/3"></div>
                     </div>
                  </div>
                }
              }
           </div>
        </aside>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class LectureVideoComposant implements OnInit {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private location = inject(Location);
  private serviceFilm = inject(FilmService);
  
  videoId = signal<string | null>(null);
  titre = signal<string>('Bande-annonce');
  videoUrl = signal<SafeResourceUrl | null>(null);

  filmsSuggestions = computed(() => {
    // Return up to 6 popular movies as suggestions
    return this.serviceFilm.filmsPopulaires().slice(0, 6);
  });

  ngOnInit() {
    // Ensure we trigger the initialization of movie suggestions if not done
    this.serviceFilm.initialiser();

    this.route.params.subscribe(params => {
      const id = params['videoId'];
      if (id) {
        this.videoId.set(id);
        this.videoUrl.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}?autoplay=1&mute=0&rel=0&enablejsapi=1`)
        );
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['titre']) {
        this.titre.set(params['titre']);
      }
    });
  }

  retour() {
    this.location.back();
  }
}
