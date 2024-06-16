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
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {DeleteFileActionRendererService} from "./delete-file-action-renderer.service";
import {finalize, throwError} from "rxjs";
import {Router} from "@angular/router";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TranslocoPipe} from "@ngneat/transloco";
import {ConfirmationService} from "primeng/api";
import {catchError} from "rxjs/operators";
import {LocalizePipe} from "../../../../../../../../modules/locale";
import {
  AbstractExplorerActionRenderer
} from "../../../../default/abstract-explorer-action-renderer";
import {Store} from "../../../../../../../../modules/store";
import {Explorer} from "../../../../../../../explorer";
import {PreloaderEvent} from "../../../../../../../../modules/preloader";
import {ToastData, ToastEvent} from "../../../../../../../../global/vars";

@Component({
  selector: "delete-file-action-renderer",
  standalone: true,
  templateUrl: "./delete-file-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DeleteFileActionRendererService],
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
    ConfirmDialogModule,
    TranslocoPipe
  ],
})
export class DeleteFileActionRendererComponent extends AbstractExplorerActionRenderer {

  readonly dialogKey = "del-file-action-dialog";
  private readonly confirmationService = inject(ConfirmationService);
  private readonly service = inject(DeleteFileActionRendererService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  private get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  deleteFile() {
    this.confirmationService.confirm({
      key: this.dialogKey,
      accept: () => {
        this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
        this.service.remove(this.entityForm().controls.id.value).pipe(
          catchError((res) => {
            this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
            return throwError(res);
          }),finalize(() => {
            this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
          })).subscribe(() => {
          this.router.navigate(["/section/files"], {replaceUrl: true});
        });
      }
    });
  }

}
