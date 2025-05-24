import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/service/product.service';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
  styles: ``
})
export class ProductPageComponent {
  
  private route = inject(ActivatedRoute);
  private _service = inject(ProductService);

  idSlugParam = this.route.snapshot.paramMap.get('idSlug');

  productResource = rxResource({
    request: () => ({ idSlug: this.idSlugParam }),
    loader: ({ request }) => this._service.getProductByIdSlug(request.idSlug!),
  })

}
