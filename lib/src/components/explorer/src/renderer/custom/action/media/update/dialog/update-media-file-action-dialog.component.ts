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
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslocoPipe} from "@ngneat/transloco";
import {ReactiveFormsModule} from "@angular/forms";
import {ExplorerService} from "../../../../../../../../explorer";
import { MediaInputComponent, Media } from "../../../../../../../../../modules/media";
import {RefInputComponent} from "../../../../../../../../../modules/ref-input";

/**
 * This component allows users to change the details of a media file.
 */
@Component({
  selector: "update-media-file-action-dialog",
  standalone: true,
  templateUrl: "./update-media-file-action-dialog.component.html",
  styleUrls: ["./update-media-file-action-dialog.component.scss"],
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
export class UpdateMediaFileActionDialogComponent {

  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogRef = inject(DynamicDialogRef);

  /**
   * Gets the media data passed to the dialog.
   * @returns The media data.
   */
  get data() {
    return this.config.data as Media;
  }

  /**
   * Closes the dialog and returns the updated media data.
   * @param media - The updated media or an array of media items.
   */
  onChange(media: Media | Media[]) {
    this.dialogRef.close(media);
  }

}
