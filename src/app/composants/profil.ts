import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SOCIAL_FACEBOOK, SOCIAL_GITHUB, SOCIAL_LINKEDIN, SOCIAL_MAILTO } from '../configuration/config-sociaux';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-[#0a0502] text-white pt-24 px-8 md:px-20 pb-20 flex flex-col items-center">
      <div class="max-w-4xl w-full">
        <div class="flex flex-col md:flex-row items-center gap-12 bg-zinc-900/40 border border-white/5 rounded-3xl p-8 md:p-12 mb-12 backdrop-blur-xl shadow-2xl">
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img src="photo/profil.JPG" class="relative w-48 h-48 rounded-full object-cover border-4 border-zinc-800" alt="Dibi Kre Michael">
          </div>
          
          <div class="flex-1 space-y-6 text-center md:text-left">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 class="text-4xl font-black tracking-tighter mb-2">PROFIL DU CRÉATEUR</h1>
                <div class="h-1 w-20 bg-red-600 mx-auto md:mx-0"></div>
              </div>
              <img src="photo/mon_logo.png" class="w-12 h-12 object-contain opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all mx-auto md:mx-0" alt="Logo CinéMic">
            </div>

            <div class="grid gap-4">
              <div class="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <mat-icon class="text-red-500">person</mat-icon>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Créateur</p>
                  <p class="text-lg font-bold">Dibi Kre Michael</p>
                </div>
              </div>

              <div class="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <mat-icon class="text-blue-500">school</mat-icon>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Niveau</p>
                  <p class="text-lg font-bold">3e année SDDI</p>
                </div>
              </div>

              <div class="flex items-start gap-4 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <mat-icon class="text-violet-500 mt-1 font-icon">domain</mat-icon>
                <div class="flex-1">
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Établissement d'études</p>
                  <p class="text-lg font-bold">Fréquenté à ESTEM</p>
                  <div class="mt-2">
                    <img src="photo/ESTEM.png" class="h-12 w-auto object-contain rounded-md bg-white/5 p-1 border border-white/10" alt="Logo ESTEM" referrerpolicy="no-referrer">
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <mat-icon class="text-emerald-500">public</mat-icon>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nationalité</p>
                  <p class="text-lg font-bold">Ivoirienne</p>
                </div>
              </div>

              <div class="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <mat-icon class="text-amber-500">calendar_today</mat-icon>
                <div>
                  <p class="text-[10px] font-black uppercase tracking-widest text-zinc-500">Année de création du mini-projet</p>
                  <p class="text-lg font-bold">2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Social Bento Grid -->
        <div class="flex flex-col items-center gap-8 py-12">
          <h2 class="text-xl font-bold uppercase tracking-[0.3em] text-zinc-600">Me contacter</h2>
          
          <div class="main-grid">
            <div class="up-row">
              <a [href]="facebookUrl" target="_blank" class="card card1 group">
                <img src="photo/sociaux/facebook.svg" class="social-icon" alt="Facebook">
              </a>
              <a [href]="githubUrl" target="_blank" class="card card2 group">
                <img src="photo/sociaux/github.svg" class="social-icon" alt="GitHub">
              </a>
            </div>
            <div class="down-row">
              <a [href]="linkedinUrl" target="_blank" class="card card3 group">
                <img src="photo/sociaux/linkedin.svg" class="social-icon" alt="LinkedIn">
              </a>
              <a [href]="mailtoUrl" class="card card4 group">
                <img src="photo/sociaux/gmail.svg" class="social-icon" alt="Gmail">
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-grid { display: flex; flex-direction: column; gap: 0.5em; transform: rotate(-5deg); transition: transform 0.5s ease; }
    .main-grid:hover { transform: rotate(0deg); }
    .up-row, .down-row { display: flex; flex-direction: row; gap: 0.5em; }
    .card { width: 120px; height: 120px; background: white; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: none; outline: none; }
    .card1 { border-radius: 120px 5px 5px 5px; }
    .card2 { border-radius: 5px 120px 5px 5px; }
    .card3 { border-radius: 5px 5px 5px 120px; }
    .card4 { border-radius: 5px 5px 120px 5px; }
    
    .social-icon { width: 60px; height: 60px; transition: transform 0.3s ease; object-contain: contain; }
    
    .card:hover { scale: 1.15; z-index: 10; }
    .card1:hover { background-color: #1877F2; }
    .card2:hover { background-color: #333; }
    .card3:hover { background-color: #0077B5; }
    .card4:hover { background-color: #EA4335; }
    .card:hover .social-icon { transform: scale(1.1); filter: brightness(0) invert(1); }
  `]
})
export class ProfilComposant {
  facebookUrl = SOCIAL_FACEBOOK;
  githubUrl = SOCIAL_GITHUB;
  linkedinUrl = SOCIAL_LINKEDIN;
  mailtoUrl = SOCIAL_MAILTO;
}
