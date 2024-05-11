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
import {finalize, throwError} from "rxjs";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslocoService} from "@ngneat/transloco";
import {XdbExportDialog} from "./xdb-export-dialog.constants";
import {Store} from "../../../modules/store/store";
import {XdbService} from "../xdb.service";
import {XdbExportDialogParams} from "../xdb.types";
import {Xdb} from "../xdb.constants";
import {PreloaderEvent} from "../../../modules/preloader/preloader.event";
import {ToastData} from "../../../global/types";
import {ToastEvent} from "../../../global/events";
import {environment} from "../../../global/env/env";
import createForm = XdbExportDialog.createForm;


@Injectable()
export class XdbExportDialogViewModel {

  readonly form = createForm();
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly store = inject(Store);
  private readonly xdbService = inject(XdbService);
  private readonly ts = inject(TranslocoService);

  get data() {
    return this.config.data as XdbExportDialogParams;
  }

  get preloaderChannel() {
    return Xdb.PreloaderCn;
  }

  export() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.xdbService.exportData(this.form.getRawValue()).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(() => res);
      }),
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel))
    ).subscribe(v => {
      this.store.emit<ToastData>(ToastEvent.Success, {message: this.ts.translate("xdb.export.success")});
      if (v.file) {
        window.open(`${environment.tmpUrl}/${v.file}`, "_blank");
      }
      this.ref.close();
    });
  }

}
