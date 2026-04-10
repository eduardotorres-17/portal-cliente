import 'zone.js'; // 👈 O Herói que estava faltando! Adicione esta linha.

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

// 👇 Aqui vai estar a importação do seu componente principal
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) =>
  console.error(err)
);
