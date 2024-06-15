/*
 * Copyright 2023 Alexander Kiriliuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslocoPipe} from "@ngneat/transloco";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {RefInputComponent} from "../../../../../../../../modules/ref-input/ref-input.component";
import {ExplorerService} from "../../../../../../explorer.service";
import {FileInputComponent} from "../../../../../../../../modules/file/input/file-input.component";
import {File} from "../../../../../../../../modules/file/file.types";

@Component({
  selector: "create-file-action-dialog",
  standalone: true,
  templateUrl: "./create-file-action-dialog.component.html",
  styleUrls: ["./create-file-action-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExplorerService
  ],
  imports: [
    RefInputComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    FileInputComponent,
    CheckboxModule
  ],
})
export class CreateFileActionDialogComponent {

  readonly isPublic: FormControl<boolean> = new FormControl(true);
  private readonly dialogRef = inject(DynamicDialogRef);

  onChange(media: File | File[]) {
    this.dialogRef.close(media);
  }

}
