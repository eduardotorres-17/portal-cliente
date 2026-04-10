import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'portal-web-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
// 👇 AQUI ESTAVA AppComponent, VAMOS MUDAR PARA App PARA AGRADAR O main.ts
export class App {
  title = 'portal-web';
}
