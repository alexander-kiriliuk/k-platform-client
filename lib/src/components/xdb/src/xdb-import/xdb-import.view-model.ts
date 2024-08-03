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

import {inject, Injectable} from "@angular/core";
import {FileUploadErrorEvent, FileUploadEvent} from "primeng/fileupload";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {TranslocoService} from "@ngneat/transloco";
import {DashboardEvent, ToastData, ToastEvent} from "../../../../global/vars";
import {Store} from "../../../../modules/store";
import {Xdb} from "../xdb.constants";
import {XdbService} from "../xdb.service";
import {PreloaderEvent} from "../../../../modules/preloader";
import {usePreloader} from "../../../../modules/preloader/src/use-preloader";

/**
 * ViewModel for the XDB import component. Manages file upload and import operations.
 */
@Injectable()
export class XDBImportViewModel {

  private readonly ts = inject(TranslocoService);
  private readonly xdbService = inject(XdbService);
  private readonly store = inject(Store);

  /**
   * Initializes the ViewModel and sets the header title.
   */
  constructor() {
    this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("xdb.title"));
  }

  /**
   * Gets the preloader channel name.
   * @returns The preloader channel name.
   */
  get preloaderChannel() {
    return Xdb.PreloaderCn;
  }

  /**
   * Handles actions before uploading a file.
   */
  onBeforeUploadFile() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
  }

  /**
   * Handles actions after successfully uploading a file.
   * @param {FileUploadEvent} payload - The file upload event payload.
   */
  onUploadFile(payload: FileUploadEvent) {
    this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
    this.store.emit<ToastData>(ToastEvent.Success, {
      title: this.ts.translate("xdb.success.upload"), message: payload.files[0].name
    });
  }

  /**
   * Handles errors during file upload.
   * @param {FileUploadErrorEvent} payload - The file upload error event payload.
   */
  onErrorFileUpload(payload: FileUploadErrorEvent) {
    this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
    this.store.emit<ToastData>(ToastEvent.Error, {
      title: payload.error.error.message, message: payload.error.error.statusCode
    });
  }

  /**
   * Imports data into the XDB system.
   * @param {string} value - The XML data to be imported.
   */
  doImport(value: string) {
    this.xdbService.importData(value).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(() => {
      this.store.emit<ToastData>(ToastEvent.Success, {
        title: this.ts.translate("xdb.success.import")
      });
    });
  }

}
