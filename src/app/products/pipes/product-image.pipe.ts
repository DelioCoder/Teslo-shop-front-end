import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
    name: 'productImage'
})
export class ProductImagePipe implements PipeTransform {
    transform(value: null | string | string[]): string {
        
        if(!value) return './assets/images/no-image.webp';

        const blobExists = value.includes('blob:');

        if (blobExists) return value as string;

        if (typeof value === "string") return `${baseUrl}/files/product/${value}`;

        const image = value.at(0);

        if(!image) return './assets/images/no-image.webp';

        return `${baseUrl}/files/product/${image}`;

        // if(!value) return './assets/images/no-image.webp';
        
        // array > 1 = primer elemento

        // if(value.length > 1) return `${baseUrl}/files/product/${value[0]}`;
        
        // placeholder image: ./assets/images/no-image.jpg

        // return `${baseUrl}/files/product/${value}`;

        // string = string


    }
}