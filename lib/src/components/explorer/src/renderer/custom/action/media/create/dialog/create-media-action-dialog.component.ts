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
import {ExplorerService} from "../../../../../../../../explorer";
import {RefInputComponent} from "../../../../../../../../../modules/ref-input";
import {Media, MediaType, MediaInputComponent} from "../../../../../../../../../modules/media";

/**
 * This component allows users to input details for a new media file.
 */
@Component({
  selector: "create-media-action-dialog",
  standalone: true,
  templateUrl: "./create-media-action-dialog.component.html",
  styleUrls: ["./create-media-action-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExplorerService
  ],
  imports: [
    MediaInputComponent,
    RefInputComponent,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
})
export class CreateMediaActionDialogComponent {

  /** Control for determining if the media is public. */
  readonly typeCtrl: FormControl<MediaType> = new FormControl();
  private readonly dialogRef = inject(DynamicDialogRef);

  /**
   * Closes the dialog and returns the new media data.
   * @param media - The created media or an array of media items.
   */
  onChange(media: Media | Media[]) {
    this.dialogRef.close(media);
  }

}
