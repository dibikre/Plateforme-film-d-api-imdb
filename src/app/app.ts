import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {BarreNavigation} from './composants/barre-navigation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, BarreNavigation],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
