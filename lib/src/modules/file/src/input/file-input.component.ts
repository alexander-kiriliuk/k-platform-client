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
  OnChanges,
  output,
  SimpleChanges
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {FileUploadErrorEvent, FileUploadEvent, FileUploadModule} from "primeng/fileupload";
import {NgTemplateOutlet} from "@angular/common";
import {HttpResponse} from "@angular/common/http";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {File as KFile} from "../file.types";
import {finalize} from "rxjs";
import {DialogService} from "primeng/dynamicdialog";
import {FileSizePipe} from "../file-size.pipe";
import {LocalizePipe} from "../../../locale";
import {Store} from "../../../store";
import {SectionDialogConfig, ExplorerService} from "../../../../components/explorer";
import {ToastData, ToastEvent} from "../../../../global/vars";

@Component({
  selector: "file-input",
  standalone: true,
  templateUrl: "./file-input.component.html",
  styleUrls: ["./file-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FileUploadModule,
    FileSizePipe,
    LocalizePipe,
    TranslocoPipe,
    NgTemplateOutlet
  ],
  providers: [
    DialogService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileInputComponent
    },
  ]
})
export class FileInputComponent implements ControlValueAccessor, OnChanges {

  changeFile = output<KFile | KFile[]>();
  placeholder = input<string>();
  multi = input<boolean>();
  galleryEnabled = input(true);
  isPublic = input(true);
  targetLoadingState: boolean;
  disabled = false;
  data: KFile | KFile[];
  uploadedFiles: File[];
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ts = inject(TranslocoService);
  private readonly dialogService = inject(DialogService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly explorerService = inject(ExplorerService);

  get uploadUrl() {
    return `/file/upload?public=${this.isPublic()}`;
  }

  get multiValue() {
    return this.data as KFile[];
  }

  get singleValue() {
    return this.data as KFile;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.isPublic.firstChange && changes.isPublic.currentValue !== changes.isPublic.previousValue) {
      this.cdr.detectChanges();
    }
  }

  writeValue(res: KFile | KFile[]) {
    if (!res) {
      return;
    }
    this.data = res;
    this.cdr.markForCheck();
  }

  onUpload(event: FileUploadEvent) {
    this.uploadedFiles = [];
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }
    const res = (event.originalEvent as HttpResponse<KFile>).body;
    if (this.multi()) {
      if (!this.data) {
        this.data = [];
      }
      (this.data as KFile[]).push(res);
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

  onUploadError(e: FileUploadErrorEvent) {
    this.store.emit<ToastData>(ToastEvent.Error, {
      title: this.ts.translate("msg.error"), message: e.error.error?.message || e.error.error?.status
    });
  }

  removeUploadedMedia(idx: number) {
    if (!this.multi()) {
      this.data = undefined;
    } else {
      (this.data as KFile[]).splice(idx, 1);
    }
    this.synchronize();
    this.cdr.markForCheck();
  }

  openFilesSection() {
    this.targetLoadingState = true;
    this.explorerService.getTarget("FileEntity", "section").pipe(finalize(() => {
      this.targetLoadingState = false;
      this.cdr.markForCheck();
    })).subscribe(payload => {
      import("../../../../components/explorer").then(m => {
        this.dialogService.open(m.ExplorerSectionComponent, {
          header: this.localizePipe.transform(payload.entity.name, payload.entity.target) as string,
          data: {target: payload, multi: this.multi()} as SectionDialogConfig,
          modal: true,
          position: "top",
        }).onClose.subscribe((res: KFile | KFile[]) => {
          if (!res) {
            return;
          }
          if (this.multi()) {
            if (!this.data) {
              this.data = [];
            }
            this.data = (this.data as KFile[]).concat(res);
          } else {
            this.data = res;
          }
          this.synchronize();
          this.cdr.markForCheck();
        });
      });
    });
  }

  synchronize() {
    this.onChange(this.data);
    this.changeFile.emit(this.data);
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

  onChange = (_: KFile | KFile[]) => {
  };

  onTouched = () => {
  };

}
