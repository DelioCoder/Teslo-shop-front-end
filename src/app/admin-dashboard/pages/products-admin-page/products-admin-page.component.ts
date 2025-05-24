import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from '@products/components/product-table/product-table.component';
import { ProductService } from '@products/service/product.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
  styles: ``
})
export class ProductsAdminPageComponent {

  productService = inject(ProductService);

  paginationService = inject(PaginationService);

  perPage = signal(10);

  productResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.perPage(),
    }),
    loader: ({ request }) => this.productService.getProducts({
      offset: request.page * this.perPage(),
      limit: request.limit,
    }),
  })

  products    = computed(() => this.productResource.value()?.products ?? []);
  pages       = computed(() => this.productResource.value()?.pages ?? 0);
  currentPage = computed(() => this.paginationService.currentPage());

}
