import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbarComponent } from "../../components/front-navbar/front-navbar.component";
import 'animate.css';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontNavbarComponent, FooterComponent],
  templateUrl: './store-front-layout.component.html',
  styles: ``
})
export class StoreFrontLayoutComponent {

}
