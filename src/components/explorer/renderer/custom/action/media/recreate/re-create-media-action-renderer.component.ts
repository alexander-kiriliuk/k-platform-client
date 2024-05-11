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
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {TranslocoPipe} from "@ngneat/transloco";
import {ConfirmationService} from "primeng/api";
import {finalize, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {AbstractExplorerActionRenderer} from "../../../../default/abstract-explorer-action-renderer";
import {PreloaderComponent} from "../../../../../../../modules/preloader/preloader.component";
import {LocalizePipe} from "../../../../../../../modules/locale/localize.pipe";
import {Store} from "../../../../../../../modules/store/store";
import {MediaService} from "../../../../../../../modules/media/media.service";
import {Explorer} from "../../../../../explorer.constants";
import {PreloaderEvent} from "../../../../../../../modules/preloader/preloader.event";
import {ToastEvent} from "../../../../../../../global/events";
import {ToastData} from "../../../../../../../global/types";
import {ExplorerEvent} from "../../../../../object/explorer.event";

@Component({
  selector: "re-create-media-action-renderer",
  standalone: true,
  templateUrl: "./re-create-media-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MediaService],
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
    ConfirmDialogModule,
    PreloaderComponent,
    TranslocoPipe
  ],
})
export class ReCreateMediaActionRendererComponent extends AbstractExplorerActionRenderer {

  readonly dialogKey = "recreate-media-action-dialog";
  private readonly confirmationService = inject(ConfirmationService);
  private readonly store = inject(Store);
  private readonly service = inject(MediaService);

  private get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  reCreateMedia() {
    this.confirmationService.confirm({
      key: this.dialogKey,
      accept: () => {
        this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
        this.service.reCreate(this.entityForm().controls.id.value).pipe(
          catchError((res) => {
            this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
            return throwError(res);
          }),
          finalize(() => {
            this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
          })).subscribe(() => {
          this.store.emit(ExplorerEvent.ReloadObject);
        });
      }
    });
  }

}
