import { Component, inject, OnInit, signal, VERSION } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FavorisService } from '../services/favoris';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../services/config';

interface InfosIP {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  org: string;
}

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#0a0502] text-white pt-24 px-8 md:px-20 pb-20">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-black mb-2 flex items-center gap-3">
          <mat-icon class="scale-125">settings</mat-icon>
          CONFIGURATIONS
        </h1>
        <p class="text-zinc-500 mb-12">Gérez les paramètres de votre application et consultez vos informations système.</p>

        <div class="grid gap-8">
          <!-- Section API Keys -->
          <section class="bg-zinc-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold flex items-center gap-2">
                <mat-icon class="text-blue-500">api</mat-icon>
                Clés d'API Personnalisées
              </h2>
              @if (saved()) {
                <span class="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-fade-in">
                  <mat-icon class="text-sm">check_circle</mat-icon>
                  Enregistré
                </span>
              }
            </div>
            
            <p class="text-sm text-zinc-500 mb-6">
              Saisissez vos propres clés API pour outrepasser les limites par défaut. 
              Elles sont stockées localement de manière sécurisée (obfuscation) dans votre navigateur.
            </p>

            <div class="grid gap-6">
              <div class="space-y-2">
                <label for="omdbKey" class="text-[10px] font-black uppercase tracking-widest text-zinc-500">OMDB API Key</label>
                <div class="relative">
                  <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">vpn_key</mat-icon>
                  <input 
                    id="omdbKey"
                    type="password"
                    [value]="config.omdbKey() || ''"
                    (input)="updateOmdb($event)"
                    placeholder="Saisissez votre clé OMDB..."
                    class="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-blue-500/50 outline-none transition-all font-mono"
                  >
                </div>
              </div>

              <div class="space-y-2">
                <label for="youtubeKey" class="text-[10px] font-black uppercase tracking-widest text-zinc-500">YouTube API Key</label>
                <div class="relative">
                  <mat-icon class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600">videocam</mat-icon>
                  <input 
                    id="youtubeKey"
                    type="password"
                    [value]="config.youtubeKey() || ''"
                    (input)="updateYoutube($event)"
                    placeholder="Saisissez votre clé YouTube..."
                    class="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-red-500/50 outline-none transition-all font-mono"
                  >
                </div>
              </div>
            </div>
          </section>

          <!-- Section Compte & Données -->
          <section class="bg-zinc-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <mat-icon class="text-red-500">storage</mat-icon>
              Données de l'application
            </h2>
            
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <p class="font-bold">Vider tous vos favoris</p>
                <p class="text-sm text-zinc-500">Cette action est irréversible et supprimera tous les films de votre liste.</p>
              </div>
              <button 
                (click)="confirmerVidage()"
                [class]="messageConfirmation() ? 'bg-red-600' : 'bg-red-600/20 hover:bg-red-600/30 text-red-500 hover:text-white'"
                class="px-6 py-2 rounded-lg font-bold transition-all active:scale-95 flex items-center gap-2"
              >
                <mat-icon>{{ messageConfirmation() ? 'warning' : 'delete_sweep' }}</mat-icon>
                {{ messageConfirmation() ? 'Êtes-vous sûr ?' : 'Vider ma liste' }}
              </button>
            </div>
          </section>

          <!-- Section Système -->
          <section class="bg-zinc-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <mat-icon class="text-emerald-500">language</mat-icon>
              Informations Réseau & Système
            </h2>
            
            <div class="space-y-6">
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-black/40 rounded-xl p-4 border border-white/5">
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Votre Adresse IP</p>
                  <p class="text-lg font-mono text-emerald-400">{{ infosIP()?.ip || 'Chargement...' }}</p>
                </div>
                <div class="bg-black/40 rounded-xl p-4 border border-white/5">
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Version Angular</p>
                  <p class="text-lg font-mono text-blue-400">v{{ versionAngular }}</p>
                </div>
              </div>

              @if (infosIP()) {
                <div class="bg-black/40 rounded-xl p-6 border border-white/5">
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Emplacement Géographique</p>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p class="text-xs text-zinc-500">Ville</p>
                      <p class="font-medium">{{ infosIP()?.city }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-zinc-500">Région</p>
                      <p class="font-medium">{{ infosIP()?.region }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-zinc-500">Pays</p>
                      <p class="font-medium">{{ infosIP()?.country_name }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-zinc-500">Fournisseur</p>
                      <p class="font-medium truncate">{{ infosIP()?.org }}</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </section>

          <!-- Section Préférences (Bonus) -->
          <section class="bg-zinc-900/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl opacity-50">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <mat-icon class="text-amber-500">palette</mat-icon>
              Préférences d'affichage (Prochainement)
            </h2>
            <div class="flex items-center justify-between">
              <p class="text-sm text-zinc-400 italic">Ces paramètres seront disponibles dans une future mise à jour.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  `
})
export class Configuration implements OnInit {
  private serviceFavoris = inject(FavorisService);
  private http = inject(HttpClient);
  config = inject(ConfigService);
  
  infosIP = signal<InfosIP | null>(null);
  versionAngular = VERSION.full;
  messageConfirmation = signal(false);
  saved = signal(false);
  private saveTimeout: ReturnType<typeof setTimeout> | undefined;

  ngOnInit() {
    this.recupererInfosIP();
  }

  updateOmdb(event: Event) {
    const key = (event.target as HTMLInputElement).value;
    this.config.enregistrerOmdbKey(key);
    this.showSaved();
  }

  updateYoutube(event: Event) {
    const key = (event.target as HTMLInputElement).value;
    this.config.enregistrerYouTubeKey(key);
    this.showSaved();
  }

  private showSaved() {
    this.saved.set(true);
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saved.set(false), 2000);
  }

  recupererInfosIP() {
    this.http.get<InfosIP>('https://ipapi.co/json/').subscribe({
      next: (infos) => this.infosIP.set(infos),
      error: () => {
        // Fallback si l'API échoue
        this.infosIP.set({
          ip: 'Non disponible',
          city: 'Inconnu',
          region: 'Inconnu',
          country_name: 'Inconnu',
          org: 'Inconnu'
        });
      }
    });
  }

  confirmerVidage() {
    if (!this.messageConfirmation()) {
      this.messageConfirmation.set(true);
      setTimeout(() => this.messageConfirmation.set(false), 3000);
      return;
    }

    this.serviceFavoris.viderTout();
    this.messageConfirmation.set(false);
  }
}
