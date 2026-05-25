import { Component, OnInit, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ActeurService, Acteur } from '../services/acteur';
import { FavorisService } from '../services/favoris';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acteurs',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] text-white p-8 md:p-12 lg:p-16 ml-20">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 class="text-4xl md:text-5xl font-black tracking-tight mb-2">ACTEURS</h1>
            <p class="text-zinc-500 font-medium italic">Découvrez les visages derrière vos histoires préférées.</p>
          </div>

          <div class="flex flex-wrap items-center gap-4">
            <!-- Barre de Recherche -->
            <div class="relative group">
              <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors">search</mat-icon>
              <input 
                type="text" 
                placeholder="Rechercher un acteur..."
                (input)="setRecherche($any($event.target).value)"
                class="bg-zinc-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-red-600/50 focus:border-red-600 outline-none w-full md:w-64 backdrop-blur-sm transition-all"
              >
            </div>

            <div class="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-xl border border-white/5 backdrop-blur-sm px-4">
              <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Trier par :</span>
              <select 
                (change)="setTri($any($event.target).value)"
                class="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer pr-8"
              >
                <option value="az">Nom (A-Z)</option>
                <option value="za">Nom (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        @if (chargement() && tousLesActeurs().length === 0) {
          <!-- Skeleton Loader -->
        } @else if (acteursAffiches().length > 0) {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-12">
            @for (acteur of acteursAffiches(); track acteur.id) {
              <div 
                (click)="voirDetails(acteur.id)"
                (keydown.enter)="voirDetails(acteur.id)"
                tabindex="0"
                class="group relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-red-600/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer outline-none focus:ring-2 focus:ring-red-600"
              >
                <div class="aspect-[2/3] overflow-hidden relative">
                  @if (acteur.imageProfil) {
                    <img 
                      [src]="acteur.imageProfil" 
                      [alt]="acteur.nom"
                      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerpolicy="no-referrer"
                    >
                  } @else {
                    <div class="w-full h-full bg-zinc-800 flex items-center justify-center">
                      <mat-icon class="text-zinc-600 scale-150">person</mat-icon>
                    </div>
                  }
                  <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  
                  <!-- Bouton Favori -->
                  <button 
                    (click)="basculerFavori($event, acteur)"
                    class="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                    [class.text-red-500]="favorisService.estActeurFavori(acteur.id)"
                  >
                    <mat-icon class="text-sm">{{ favorisService.estActeurFavori(acteur.id) ? 'favorite' : 'favorite_border' }}</mat-icon>
                  </button>
                </div>
                
                <div class="p-4 relative">
                  <h3 class="font-black text-sm uppercase tracking-wide group-hover:text-red-500 transition-colors line-clamp-1">
                    {{ acteur.nom }}
                  </h3>
                  <p class="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter line-clamp-1">
                    {{ acteur.professionsListe }}
                  </p>
                </div>
              </div>
            }
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center gap-4 mt-12 mb-20">
            <button 
              (click)="pagePrecedente()"
              [disabled]="page() === 1"
              class="p-4 rounded-full bg-zinc-900 border border-white/5 disabled:opacity-30 hover:bg-red-600 transition-colors group"
            >
              <mat-icon class="group-hover:scale-110 transition-transform">chevron_left</mat-icon>
            </button>
            
            <div class="flex items-center gap-2">
              <span class="text-zinc-500 text-sm font-bold uppercase tracking-widest">Page</span>
              <input 
                type="number"
                [value]="page()"
                (change)="allerAPage($event)"
                (keyup.enter)="allerAPage($event)"
                min="1"
                [max]="totalPages()"
                class="w-16 text-center text-xl font-black text-white px-2 py-2 bg-zinc-900 rounded-lg border border-white/10 shadow-xl focus:border-red-600 focus:ring-0 outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              >
              <span class="text-zinc-500 text-sm font-bold uppercase tracking-widest">sur {{ totalPages() }}</span>
            </div>

            <button 
              (click)="pageSuivante()"
              [disabled]="page() === totalPages()"
              class="p-4 rounded-full bg-zinc-900 border border-white/5 disabled:opacity-30 hover:bg-red-600 transition-colors group"
            >
              <mat-icon class="group-hover:scale-110 transition-transform">chevron_right</mat-icon>
            </button>
          </div>
        } @else {
          <div class="flex flex-col items-center justify-center py-40 gap-4">
            <mat-icon class="text-zinc-700 scale-[3] mb-4">person_off</mat-icon>
            <p class="text-zinc-500 font-bold">Aucun acteur trouvé pour le moment.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    select option {
      background-color: #18181b;
      color: white;
    }
  `]
})
export class ActeursComposant implements OnInit {
  private serviceActeur = inject(ActeurService);
  favorisService = inject(FavorisService);
  private router = inject(Router);
  
  tousLesActeurs = signal<Acteur[]>([]);
  chargement = signal(true);
  tri = signal<'az' | 'za'>('az');
  recherche = signal('');
  page = signal(1);
  taillePage = 30;

  acteursTries = computed(() => {
    let list = [...this.tousLesActeurs()];
    
    // Filtrage par recherche
    const query = this.recherche().toLowerCase().trim();
    if (query) {
      list = list.filter(a => a.nom.toLowerCase().includes(query));
    }

    // Tri
    if (this.tri() === 'az') {
      return list.sort((a, b) => a.nom.localeCompare(b.nom));
    } else {
      return list.sort((a, b) => b.nom.localeCompare(a.nom));
    }
  });

  totalPages = computed(() => Math.ceil(this.acteursTries().length / this.taillePage) || 1);

  acteursAffiches = computed(() => {
    const debut = (this.page() - 1) * this.taillePage;
    return this.acteursTries().slice(debut, debut + this.taillePage);
  });

  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.serviceActeur.getActeursProgressivement().subscribe({
        next: (acteurs) => {
          this.tousLesActeurs.set(acteurs);
          if (acteurs.length > 0) {
            this.chargement.set(false);
          }
        },
        complete: () => {
          this.chargement.set(false);
        },
        error: () => {
          this.chargement.set(false);
        }
      });
    } else {
      this.chargement.set(false);
    }
  }

  setTri(val: 'az' | 'za') {
    this.tri.set(val);
    this.page.set(1);
  }

  setRecherche(val: string) {
    this.recherche.set(val);
    this.page.set(1);
  }

  allerAPage(event: Event) {
    const target = event.target as HTMLInputElement;
    const nouvellePage = parseInt(target.value, 10);
    if (!isNaN(nouvellePage) && nouvellePage >= 1 && nouvellePage <= this.totalPages()) {
      this.page.set(nouvellePage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // On remet la valeur actuelle si la saisie est invalide
      target.value = this.page().toString();
    }
  }

  pageSuivante() {
    if (this.page() < this.totalPages()) {
      this.page.update(p => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  pagePrecedente() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  basculerFavori(event: Event, acteur: Acteur) {
    event.stopPropagation();
    this.favorisService.basculerActeur(acteur);
  }

  voirDetails(id: string) {
    this.router.navigate(['/acteur', id]);
  }
}
