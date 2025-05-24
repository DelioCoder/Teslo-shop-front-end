import { Component, inject } from '@angular/core';
import { map, tap } from 'rxjs';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/service/product.service';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
  styles: ``
})
export class GenderPageComponent {

  private _route = inject(ActivatedRoute);
  private _productService = inject(ProductService);
  paginationService = inject(PaginationService);

  // Dynamic param using signals
  gender = toSignal(
    this._route.params.pipe(
      map(({ gender }) => gender)
    )
  );

  productsResponse = rxResource({
    request: () => ({ gender: this.gender(), limit: 8, page: this.paginationService.currentPage() - 1 }),
    loader: ({ request }) => this._productService.getProducts({ gender: request.gender, limit: request.limit, offset: request.page * 9 })
  })

}
