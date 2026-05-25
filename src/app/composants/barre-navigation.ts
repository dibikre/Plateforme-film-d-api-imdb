import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-barre-navigation',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <nav 
      class="fixed left-0 top-0 bottom-0 w-16 md:w-20 lg:w-20 hover:lg:w-64 flex flex-col py-8 bg-black/95 backdrop-blur-xl border-r border-white/5 z-50 transition-all duration-300 overflow-hidden group"
      [class.menu-ouvert]="estOuvert()"
    >
      <div class="mb-12 px-4 flex items-center gap-4">
        <img src="photo/mon_logo.png" class="w-10 h-10 md:w-12 md:h-12 shrink-0 object-cover rounded-full border border-white/10" alt="Logo">
        <span class="text-xl font-black tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">CINÉ<span class="text-red-600">MIC</span></span>
      </div>

      <ul class="flex flex-col gap-2 flex-1 px-3 md:px-4">
        <li class="lg:hidden">
          <button (click)="basculerMenu()" class="nav-item w-full text-left bg-transparent border-0">
            <mat-icon class="shrink-0 transition-transform duration-300" [class.rotate-180]="estOuvert()">chevron_right</mat-icon>
            <span class="nav-label">Réduire</span>
          </button>
        </li>
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
          <a routerLink="/acteurs" routerLinkActive="active-link" class="nav-item">
            <mat-icon class="shrink-0">people</mat-icon>
            <span class="nav-label">Acteurs</span>
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
        <li>
          <a routerLink="/profil" routerLinkActive="active-link" class="nav-item">
            <img src="photo/profil.JPG" class="w-6 h-6 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all shrink-0" alt="Profil">
            <span class="nav-label">Profil</span>
          </a>
        </li>
      </ul>

      <div class="mt-auto px-4">
        <a routerLink="/configuration" routerLinkActive="active-link" class="nav-item w-full">
          <mat-icon class="shrink-0">settings</mat-icon>
          <span class="nav-label">Configurations</span>
        </a>
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
    .active-link img {
      filter: grayscale(0) !important;
      outline: 2px solid #e50914;
      outline-offset: 1px;
    }
    .menu-ouvert {
      width: 16rem !important;
    }
    .menu-ouvert .nav-label {
      opacity: 1 !important;
    }
    .menu-ouvert span {
      opacity: 1 !important;
    }
  `]
})
export class BarreNavigation {
  estOuvert = signal(false);

  basculerMenu() {
    this.estOuvert.update(u => !u);
  }
}
