import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-barre-recherche',
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="relative w-full max-w-2xl mx-auto">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <mat-icon class="text-white/40">search</mat-icon>
      </div>
      <input
        [formControl]="rechercheControl"
        type="text"
        placeholder="Rechercher un film, une série..."
        class="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600/50 transition-all placeholder:text-white/30 backdrop-blur-md"
        (keyup.enter)="lancerRecherche()"
      />
      @if (rechercheControl.value) {
        <button 
          (click)="effacer()"
          class="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
        >
          <mat-icon>close</mat-icon>
        </button>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class BarreRecherche {
  rechercheControl = new FormControl('');
  @Output() recherche = new EventEmitter<string>();

  lancerRecherche() {
    const valeur = this.rechercheControl.value;
    if (valeur && valeur.trim()) {
      this.recherche.emit(valeur.trim());
    }
  }

  effacer() {
    this.rechercheControl.setValue('');
  }
}
