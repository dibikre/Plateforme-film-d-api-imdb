import { Component, inject, OnInit, signal } from '@angular/core';
import { FilmService } from '../services/film';
import { MatIconModule } from '@angular/material/icon';
import { Youtube } from '../services/youtube';
import { ResultatImdb } from '../services/recherche-imdb';
import { forkJoin, map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';

interface VideoApercu {
  id: string;
  titre: string;
  videoId: string;
  thumbnail: string;
}

@Component({
  selector: 'app-videos',
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="px-8 py-12">
      <header class="mb-12">
        <div class="flex items-center gap-4 mb-4">
          <button (click)="retour()" class="p-2 hover:bg-white/10 rounded-full transition-colors group">
            <mat-icon class="text-zinc-500 group-hover:text-white">arrow_back</mat-icon>
          </button>
          <h1 class="text-4xl font-black uppercase tracking-widest">Vidéos</h1>
        </div>
        <p class="text-zinc-500 ml-12">Les dernières bandes-annonces et extraits exclusifs.</p>
      </header>

      @if (chargement()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="animate-pulse aspect-video bg-white/5 rounded-3xl"></div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (video of videos(); track video.id) {
            <a [routerLink]="['/lecture', video.videoId]" [queryParams]="{titre: video.titre}" class="group space-y-4 block">
              <div class="relative aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-red-600/50 transition-all duration-500 shadow-2xl">
                <img 
                  [src]="video.thumbnail" 
                  [alt]="video.titre"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerpolicy="no-referrer"
                />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div class="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <mat-icon class="text-white !text-4xl !w-9 !h-9">play_arrow</mat-icon>
                   </div>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-bold group-hover:text-red-600 transition-colors line-clamp-1">{{ video.titre }}</h3>
                <p class="text-xs text-zinc-500 text-uppercase tracking-widest font-bold">Bande-annonce officielle</p>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `
})
export class VideosComposant implements OnInit {
  private serviceFilm = inject(FilmService);
  private youtube = inject(Youtube);
  private location = inject(Location);

  videos = signal<VideoApercu[]>([]);
  chargement = signal(true);

  ngOnInit() {
    this.serviceFilm.rechercher('2026 trailers').subscribe(films => {
      const query = films.length > 5 ? films : [];
      
      const prepareVideos = (candidates: ResultatImdb[]) => {
        const videoRequests = candidates.slice(0, 20).map(f => 
          this.youtube.recupererBandeAnnonce(f.l).pipe(
            map(yt => ({
              id: f.id,
              titre: f.l,
              videoId: yt?.videoId || '',
              thumbnail: yt ? `https://img.youtube.com/vi/${yt.videoId}/maxresdefault.jpg` : ''
            }))
          )
        );

        forkJoin(videoRequests).subscribe(res => {
          this.videos.set(res.filter(v => v.videoId !== ''));
          this.chargement.set(false);
        });
      };

      if (query.length === 0) {
        this.serviceFilm.rechercher('latest movie trailers 2024 2025').subscribe(res => prepareVideos(res));
      } else {
        prepareVideos(films);
      }
    });
  }

  retour() {
    this.location.back();
  }
}
