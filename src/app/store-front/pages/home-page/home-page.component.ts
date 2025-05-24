import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { ProductService } from '@products/service/product.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
  styles: ``
})
export class HomePageComponent {

  productsService = inject(ProductService);

  paginationService = inject(PaginationService);

  productsResponse = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => {
      return this.productsService.getProducts({
        offset: request.page * 9
      });
    }
  });

}
