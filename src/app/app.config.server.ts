import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { FormsModule } from '@angular/forms';

const serverConfig: ApplicationConfig = {
  providers: [provideServerRendering(), FormsModule],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
