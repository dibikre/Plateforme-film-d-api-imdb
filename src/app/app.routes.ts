import { Routes } from '@angular/router';
import { Accueil } from './composants/accueil';
import { ResultatsRecherche } from './composants/resultats-recherche';
import { DetailFilmComponent } from './composants/detail-film';
import { FilmsComposant } from './composants/films';
import { SeriesComposant } from './composants/series';
import { VideosComposant } from './composants/videos';
import { FavorisComposant } from './composants/favoris';
import { LectureVideoComposant } from './composants/lecture-video';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'recherche', component: ResultatsRecherche },
  { path: 'film/:id', component: DetailFilmComponent },
  { path: 'films', component: FilmsComposant },
  { path: 'series', component: SeriesComposant },
  { path: 'videos', component: VideosComposant },
  { path: 'lecture/:videoId', component: LectureVideoComposant },
  { path: 'favoris', component: FavorisComposant },
  { path: '**', redirectTo: '' }
];
