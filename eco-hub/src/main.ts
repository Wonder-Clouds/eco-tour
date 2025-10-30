import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { Chart, registerables } from 'chart.js';
import { App } from './app/app';

Chart.register(...registerables);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
