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
import {
  LocalizeStringInputComponent
} from "../../../../../modules/locale";
import {RefInputComponent} from "../../../../../modules/ref-input";
import {ColumnForm} from "../../object.types";
import {Explorer, ExplorerService} from "../../../../explorer";

@Component({
  selector: "object-details-column-editor",
  standalone: true,
  templateUrl: "./object-details-column-editor.component.html",
  styleUrls: ["./object-details-column-editor.component.scss"],
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
export class ObjectDetailsColumnEditorComponent {


  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  suggestions: string[] = [];
  private readonly cdr = inject(ChangeDetectorRef);

  get colForm() {
    return this.config.data as FormGroup<ColumnForm>;
  }

  searchType(e: AutoCompleteCompleteEvent) {
    this.suggestions = Explorer.Types.filter(s => s.startsWith(e.query.trim()));
    this.cdr.markForCheck();
  }

  save() {
    this.ref.close(this.colForm);
  }

}
