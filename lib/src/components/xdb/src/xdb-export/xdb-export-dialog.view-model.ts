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
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslocoService} from "@ngneat/transloco";
import {XdbExportDialog} from "./xdb-export-dialog.constants";
import {Store} from "../../../../modules/store";
import {XdbService} from "../xdb.service";
import {XdbExportDialogParams} from "../xdb.types";
import {Xdb} from "../xdb.constants";
import {TMP_URL, ToastData, ToastEvent} from "../../../../global/vars";
import {usePreloader} from "../../../../modules/preloader/src/use-preloader";
import createForm = XdbExportDialog.createForm;

/**
 * ViewModel for the XDB export dialog. Manages the export form and operations.
 */
@Injectable()
export class XdbExportDialogViewModel {


  /** The form group representing the export parameters. **/
  readonly form = createForm();
  /** Temporary URL for accessing exported files. **/
  private readonly tmpUrl = inject(TMP_URL);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly store = inject(Store);
  private readonly xdbService = inject(XdbService);
  private readonly ts = inject(TranslocoService);

  /**
   * Gets the data for the export dialog.
   * @returns The export dialog parameters.
   */
  get data() {
    return this.config.data as XdbExportDialogParams;
  }

  /**
   * Gets the preloader channel name.
   * @returns The preloader channel name.
   */
  get preloaderChannel() {
    return Xdb.PreloaderCn;
  }

  /**
   * Initiates the export process.
   */
  export() {
    this.xdbService.exportData(this.form.getRawValue()).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(() => res);
      }),
    ).subscribe(v => {
      this.store.emit<ToastData>(ToastEvent.Success, {message: this.ts.translate("xdb.export.success")});
      if (v.file) {
        window.open(`${this.tmpUrl}/${v.file}`, "_blank");
      }
      this.ref.close();
    });
  }

}
