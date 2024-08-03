import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe} from "@ngneat/transloco";
import {XdbService} from "../xdb.service";
import {XdbExportDialogParams} from "../xdb.types";
import {CheckboxModule} from "primeng/checkbox";
import {ListboxModule} from "primeng/listbox";
import {ReactiveFormsModule} from "@angular/forms";
import {InputNumberModule} from "primeng/inputnumber";
import {XdbExportDialogViewModel} from "./xdb-export-dialog.view-model";
import {LocalizePipe} from "../../../../modules/locale";
import {PreloaderComponent, PreloaderDirective} from "../../../../modules/preloader";

/**
 * Component for displaying the XDB export dialog.
 */
@Component({
  selector: "xdb-export-dialog",
  standalone: true,
  templateUrl: "./xdb-export-dialog.component.html",
  styleUrls: ["./xdb-export-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    XdbExportDialogViewModel,
    XdbService,
    LocalizePipe
  ],
  imports: [
    ButtonModule,
    RippleModule,
    TranslocoPipe,
    PreloaderComponent,
    PreloaderDirective,
    CheckboxModule,
    ListboxModule,
    ReactiveFormsModule,
    InputNumberModule,
  ]
})
export class XdbExportDialogComponent {

  /** List of properties available for export. **/
  readonly properties: Array<{ name: string, code: string }> = [];
  readonly vm = inject(XdbExportDialogViewModel);
  private readonly config = inject(DynamicDialogConfig);
  private readonly localizePipe = inject(LocalizePipe);

  /**
   * Initializes the component, setting up form controls and localizing column names.
   */
  constructor() {
    this.vm.form.controls.id.setValue(this.data.entity[this.data.target.primaryColumn.property] as string);
    this.vm.form.controls.target.setValue(this.data.target.entity.target);
    this.data.target.entity.columns.forEach(col => {
      this.properties.push({
        code: col.property,
        name: this.localizePipe.transform(col.name, col.property) as string
      });
    });
  }

  /**
   * Gets the data passed to the dialog.
   * @returns The parameters for the export dialog.
   */
  get data() {
    return this.config.data as XdbExportDialogParams;
  }

}
