import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page.component'),
    title: 'NgForge — AI Angular Architect',
  },
  {
    path: 'generator',
    loadComponent: () => import('./features/generator/generator-page.component'),
    title: 'Generator — NgForge',
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/history-page.component'),
    title: 'History — NgForge',
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings-page.component'),
    title: 'Settings — NgForge',
  },
  { path: '**', redirectTo: '' },
];
