import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header/header.component';
import { FooterComponent } from './layout/footer/footer/footer.component';
import { SidebarComponent } from './layout/sidebar/sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PrestamiumF';
}
