import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-barre-navigation',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav class="fixed left-0 top-0 bottom-0 w-16 md:w-20 lg:w-20 hover:lg:w-64 flex flex-col py-8 bg-black/95 backdrop-blur-xl border-r border-white/5 z-50 transition-all duration-300 overflow-hidden group">
      <div class="mb-12 px-6 flex items-center gap-4">
        <mat-icon class="text-red-600 scale-125 md:scale-150 shrink-0">movie_filter</mat-icon>
        <span class="text-xl font-black tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">CINÉ<span class="text-red-600">SPHÈRE</span></span>
      </div>

      <ul class="flex flex-col gap-2 flex-1 px-3 md:px-4">
        <li>
          <a routerLink="/recherche" routerLinkActive="active-link" class="nav-item">
            <mat-icon class="shrink-0">search</mat-icon>
            <span class="nav-label">Rechercher un film</span>
          </a>
        </li>
        <li>
          <a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active-link" class="nav-item">
            <mat-icon class="shrink-0">home</mat-icon>
            <span class="nav-label">Page d'accueil</span>
          </a>
        </li>
        <li>
          <a routerLink="/films" routerLinkActive="active-link" class="nav-item">
            <mat-icon class="shrink-0">movie</mat-icon>
            <span class="nav-label">Explorer les films</span>
          </a>
        </li>
        <li>
          <a routerLink="/series" routerLinkActive="active-link" class="nav-item">
            <mat-icon class="shrink-0">tv</mat-icon>
            <span class="nav-label">Séries télévisées</span>
          </a>
        </li>
        <li>
          <a routerLink="/videos" routerLinkActive="active-link" class="nav-item">
            <mat-icon class="shrink-0">play_circle</mat-icon>
            <span class="nav-label">Vidéos et bandes</span>
          </a>
        </li>
        <li>
          <a routerLink="/favoris" routerLinkActive="active-link" class="nav-item">
            <mat-icon class="shrink-0">bookmark</mat-icon>
            <span class="nav-label">Ma liste de favoris</span>
          </a>
        </li>
      </ul>

      <div class="mt-auto px-4">
        <button class="nav-item w-full text-left">
          <mat-icon class="shrink-0">settings</mat-icon>
          <span class="nav-label">Configurations</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      color: #71717a; /* text-zinc-500 */
      border-radius: 0.75rem;
      transition: all 0.3s ease;
    }
    .nav-item:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.05);
    }
    .nav-label {
      font-weight: 500;
      opacity: 0;
      white-space: nowrap;
      transition: opacity 0.3s ease;
    }
    .group:hover .nav-label {
      opacity: 1;
    }
    mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .active-link {
      color: #e50914 !important;
      background: linear-gradient(to right, rgba(229, 9, 20, 0.1), transparent);
    }
    .active-link mat-icon {
      color: #e50914;
    }
  `]
})
export class BarreNavigation {}
