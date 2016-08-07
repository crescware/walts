import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';

import { bootstrap } from '@angular/platform-browser-dynamic';
import { init } from '../chat-example-data';
import { AppComponent } from './app.component';

init();
bootstrap(AppComponent, []);
