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
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {
  AbstractExplorerActionRenderer
} from "../../../../default/abstract-explorer-action-renderer";
import {PreloaderComponent} from "../../../../../../../../modules/preloader";
import {LocalizePipe} from "../../../../../../../../modules/locale";
import {Store} from "../../../../../../../../modules/store";
import {MediaService} from "../../../../../../../../modules/media";
import {Explorer, ExplorerEvent} from "../../../../../../../explorer";
import {ToastData, ToastEvent} from "../../../../../../../../global/vars";
import {usePreloader} from "../../../../../../../../modules/preloader/src/use-preloader";

/**
 * This component provides functionality to confirm and re-create a media file
 * after user interaction. It relies on a confirmation dialog to ensure the user
 * intends to proceed with the action.
 */
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
  /** Key for the confirmation dialog. */

  readonly dialogKey = "recreate-media-action-dialog";
  private readonly confirmationService = inject(ConfirmationService);
  private readonly store = inject(Store);
  private readonly service = inject(MediaService);

  /**
   * This method returns the channel used for indicating loading state
   * during the media re-creation process.
   * @returns The preloader channel identifier.
   */
  private get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  /**
   * This method displays a confirmation dialog, and upon acceptance,
   * it calls the media service to re-create the media file using its ID.
   * It also manages the loading state during the operation and emits
   * events based on the outcome of the re-creation process.
   */
  reCreateMedia() {
    this.confirmationService.confirm({
      key: this.dialogKey,
      accept: () => {
        this.service.reCreate(this.entityForm().controls.id.value).pipe(
          usePreloader(this.store, this.preloaderChannel),
          catchError((res) => {
            this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
            return throwError(res);
          })
        ).subscribe(() => {
          this.store.emit(ExplorerEvent.ReloadObject);
        });
      }
    });
  }

}
