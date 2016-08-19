import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { init } from '../chat-example-data';
import { AppModule } from './app.module';

init();
platformBrowserDynamic().bootstrapModule(AppModule);
