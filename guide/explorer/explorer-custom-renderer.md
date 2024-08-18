## Create custom explorer renderer

> The bulk of the instruction on working with explorer and creating custom renderers on the server can be found [here](https://github.com/alexander-kiriliuk/k-platform-core/blob/master/guide/explorer.md).

Here we will look at an example of creating a custom renderer for the `virtual-product-discount-info` virtual column from the example above.

Let's create a simple renderer component for the example that will display the price of the product with the discount and will be updated when the values of the discount and price fields change:

    @Component({
        selector: "product-discount-info-object-renderer",
        standalone: true,
        template: "Discount = {{discount()}}",
        changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class ProductDiscountInfoObjectRendererComponent extends AbstractExplorerObjectRenderer<Product> implements OnInit {
      
      discount = signal(0);
      
      ngOnInit() {
        this.entityForm.controls.discountPercent.valueChanges.subscribe(_ => this.calculateDiscount());
        this.entityForm.controls.price.valueChanges.subscribe(_ => this.calculateDiscount());
        this.calculateDiscount();
      }
      
      private calculateDiscount(){
        const price = this.entityForm.controls.price.value;
        const percent = this.entityForm.controls.discountPercent.value;
        const onePercent = price / 100;
        this.discount.set(percent * onePercent);
      }
    }

Now let's connect the loader of this renderer in the root module using the method `provideExplorerObjectRenderers()`:

    provideExplorerObjectRenderers({
      code: "virtual-product-discount-info",
      load: import("./test/product-discount-info-object-renderer.component")
        .then(m => m.ProductDiscountInfoObjectRendererComponent)
    }),

The renderer is ready, we can see the result by opening the product:

![custom-renderer-example.png](https://raw.githubusercontent.com/alexander-kiriliuk/k-platform-client/master/guide/res/custom-renderer-example.png)
