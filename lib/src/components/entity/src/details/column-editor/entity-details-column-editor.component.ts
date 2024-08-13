import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject} from "@angular/core";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {InputNumberModule} from "primeng/inputnumber";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextareaModule} from "primeng/inputtextarea";
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextModule} from "primeng/inputtext";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ButtonModule} from "primeng/button";
import { LocalizeStringInputComponent } from "../../../../../modules/locale";
import {RefInputComponent} from "../../../../../modules/ref-input";
import {ColumnForm} from "../../entity.types";
import {Explorer, ExplorerService} from "../../../../explorer";

/**
 * Component for editing the details of a column.
 */
@Component({
  selector: "entity-details-column-editor",
  standalone: true,
  templateUrl: "./entity-details-column-editor.component.html",
  styleUrls: ["./entity-details-column-editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocalizeStringInputComponent,
    ReactiveFormsModule,
    RefInputComponent,
    AutoCompleteModule,
    InputNumberModule,
    CheckboxModule,
    InputTextareaModule,
    TranslocoPipe,
    InputTextModule,
    ButtonModule
  ],
  providers: [
    ExplorerService
  ]
})
export class EntityDetailsColumnEditorComponent {

  /** List of type suggestions for the auto-complete input. **/
  suggestions: string[] = [];
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Gets the column form from the dialog configuration.
   * @returns {FormGroup<ColumnForm>} The column form.
   */
  get colForm(): FormGroup<ColumnForm> {
    return this.config.data as FormGroup<ColumnForm>;
  }

  /**
   * Searches for column types based on user input.
   * @param e The auto-complete event containing the search query.
   */
  searchType(e: AutoCompleteCompleteEvent) {
    this.suggestions = Explorer.Types.filter(s => s.startsWith(e.query.trim()));
    this.cdr.markForCheck();
  }

  /**
   * Saves the column form and closes the dialog.
   */
  save() {
    this.ref.close(this.colForm);
  }

}
