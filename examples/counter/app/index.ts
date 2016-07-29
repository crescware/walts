import 'core-js';
import 'rxjs/Rx';
import 'zone.js/dist/zone';

import { Component } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

@Component({
  selector: 'ex-app',
  directives: [],
  providers: [],
  template: `
    <h1>Hello</h1>
  `
})
class AppComponent {}

bootstrap(AppComponent, []);
