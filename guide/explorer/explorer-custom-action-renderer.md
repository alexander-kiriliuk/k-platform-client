## Create custom explorer action-renderer

> The bulk of the instruction on working with explorer and creating custom action renderers on the server can be found [here](https://github.com/alexander-kiriliuk/k-platform-core/blob/master/guide/explorer.md).

Here we will look at an example of creating a custom action renderer to reset the `price` and `discountPercent` fields of the `ProductEntity` entity.

Let's create a UI component of the action renderer that will reset the form fields:

    @Component({
      selector: "reset-product-price-and-discount-action-renderer",
      standalone: true,
      template: `
        <button pButton class="p-button-warning" (click)="resetFields()">
          {{ action.name | localize: action.code }}
        </button>`,
      imports: [
        ButtonDirective,
        LocalizePipe
      ],
      changeDetection: ChangeDetectionStrategy.OnPush
    })
    export class ResetProductPriceAndDiscountActionRendererComponent extends AbstractExplorerActionRenderer {
    
      override entityForm: InputSignal<FormGroup<{ [K in keyof Product]: FormControl<Product[K]> }>>;
      
      resetFields() {
        const ctrl = this.entityForm().controls;
        ctrl.price.setValue(0);
        ctrl.discountPercent.setValue(0);
      }
    
    }

Now let's connect the loader of this renderer in the root module using the method `provideExplorerActionRenderers()`:

    provideExplorerActionRenderers({
      code: "reset-product-price-and-discount",
      load: import("./app/test/reset-product-price-and-discount-action-renderer.component")
        .then(m => m.ResetProductPriceAndDiscountActionRendererComponent)
    }),

The renderer is ready, we can see the result by opening the product:

![custom-action-renderer-created.png](https://raw.githubusercontent.com/alexander-kiriliuk/k-platform-client/master/guide/res/custom-action-renderer-created.png)

Click on the "Reset fields" button that appears, the `price` and `discountPercent` fields will be reset.
