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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  output
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {FileUploadEvent, Media} from "../media.types";
import {FileUploadErrorEvent, FileUploadModule} from "primeng/fileupload";
import {NgTemplateOutlet} from "@angular/common";
import {HttpResponse} from "@angular/common/http";
import {MediaComponent} from "../media.component";
import {MediaTypeVariant} from "../media.constants";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {DialogService} from "primeng/dynamicdialog";
import {finalize} from "rxjs";
import {FileSizePipe} from "../../../file";
import {SectionDialogConfig, ExplorerService} from "../../../../components/explorer";
import {Store} from "../../../store";
import {ToastEvent, ToastData} from "../../../../global/vars";
import {LocalizePipe} from "../../../locale";

/**
 * MediaInputComponent that facilitates the input of media,
 * allowing for single or multiple uploads and integration with a media explorer dialog.
 */
@Component({
  selector: "media-input",
  standalone: true,
  templateUrl: "./media-input.component.html",
  styleUrls: ["./media-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FileUploadModule,
    FileSizePipe,
    MediaComponent,
    LocalizePipe,
    TranslocoPipe,
    NgTemplateOutlet
  ],
  providers: [
    ExplorerService,
    DialogService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: MediaInputComponent
    },
  ]
})
export class MediaInputComponent implements ControlValueAccessor {

  /** Event emitted when the media changes. */
  changeMedia = output<Media | Media[]>();
  /** Required media type for the input. */
  mediaType = input.required<MediaTypeVariant>();
  /** Optional media ID for associating with existing media. */
  mediaId = input<number>();
  /** Placeholder text for the media input.*/
  placeholder = input<string>();
  /** Boolean indicating whether multiple media can be uploaded. */
  multi = input<boolean>();
  /** Boolean indicating if gallery features are enabled. */
  galleryEnabled = input<boolean>(true);
  /** Boolean indicating if the input is disabled. */
  disabled = false;
  /** Array of uploaded files. */
  uploadedFiles: File[];
  /** Data representing the current media. */
  data: Media | Media[];
  /** Boolean indicating if the target is loading. */
  targetLoadingState: boolean;
  private readonly store = inject(Store);
  private readonly dialogService = inject(DialogService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly explorerService = inject(ExplorerService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ts = inject(TranslocoService);

  /**
   * Constructs the upload URL based on media type and optional media ID.
   * @returns {string}
   */
  get uploadUrl(): string {
    return `/media/upload/${this.mediaType()}${!this.mediaId() ? "" : `?id=${this.mediaId()}`}`;
  }

  /**
   * Retrieves the uploaded media as an array (multi mode).
   * @returns {Media[]}
   */
  get multiValue(): Media[] {
    return this.data as Media[];
  }

  /**
   * Retrieves the uploaded media as a single object (single mode).
   * @returns {Media}
   */
  get singleValue(): Media {
    return this.data as Media;
  }

  /**
   * Writes the value for the media input.
   * @param res - The media object or array of media to set.
   */
  writeValue(res: Media | Media[]) {
    if (!res) {
      return;
    }
    this.data = res;
    this.cdr.markForCheck();
  }

  /**
   * Handles the file upload event.
   * Updates the component state with uploaded files and media data.
   * @param event - The file upload event containing uploaded files.
   */
  onUpload(event: FileUploadEvent) {
    this.uploadedFiles = [];
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    const res = (event.originalEvent as HttpResponse<Media>).body;
    if (this.multi()) {
      if (!this.data) {
        this.data = [];
      }
      (this.data as Media[]).push(res);
    } else {
      this.data = res;
    }
    this.synchronize();
    this.cdr.markForCheck();
    setTimeout(() => {
      this.uploadedFiles = undefined;
      this.cdr.markForCheck();
    }, 3000);
  }

  /**
   * Handles errors that occur during the file upload process.
   * Displays an error message using the store service.
   * @param event - The error event containing upload error details.
   */
  onUploadError(event: FileUploadErrorEvent) {
    this.store.emit<ToastData>(ToastEvent.Error, {
      title: this.ts.translate("msg.error"), message: event.error.error?.message || event.error.error?.status
    });
  }

  /**
   * Opens a media section dialog for selecting media from a gallery.
   * Updates the data based on user selection and synchronizes the changes.
   */
  openMediaSection() {
    this.targetLoadingState = true;
    this.explorerService.getTarget("MediaEntity", "section").pipe(finalize(() => {
      this.targetLoadingState = false;
      this.cdr.markForCheck();
    })).subscribe(payload => {
      import("../../../../components/explorer").then(m => {
        this.dialogService.open(m.ExplorerSectionComponent, {
          header: this.localizePipe.transform(payload.entity.name, payload.entity.target) as string,
          data: {target: payload, multi: this.multi()} as SectionDialogConfig,
          modal: true,
          position: "top",
        }).onClose.subscribe((res: Media | Media[]) => {
          if (!res) {
            return;
          }
          if (this.multi()) {
            if (!this.data) {
              this.data = [];
            }
            this.data = (this.data as Media[]).concat(res);
          } else {
            this.data = res;
          }
          this.synchronize();
          this.cdr.markForCheck();
        });
      });
    });
  }

  /**
   * Removes an uploaded media item by its index in the array.
   * Updates the component state accordingly.
   * @param idx - The index of the media item to remove.
   */
  removeUploadedMedia(idx: number) {
    if (!this.multi()) {
      this.data = null;
    } else {
      (this.data as Media[]).splice(idx, 1);
    }
    this.synchronize();
    this.cdr.markForCheck();
  }

  /**
   * Synchronizes the current state with external change detection.
   * Emits change events and updates bound values.
   */
  synchronize() {
    this.onChange(this.data);
    this.changeMedia.emit(this.data);
  }

  registerOnChange(onChange: () => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.cdr.markForCheck();
  }

  onChange = (_: Media | Media[]) => {
  };

  onTouched = () => {
  };

}
