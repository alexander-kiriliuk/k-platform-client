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
  Injector,
  OnInit,
  runInInjectionContext
} from "@angular/core";
import {RippleModule} from "primeng/ripple";
import {ButtonModule} from "primeng/button";
import {TranslocoPipe} from "@ngneat/transloco";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProcessService} from "../../../../../../../../global/service";
import {LocalizePipe} from "../../../../../../../../modules/locale";
import {
  AbstractExplorerActionRenderer
} from "../../../../default/abstract-explorer-action-renderer";
import {Store} from "../../../../../../../../modules/store";
import {Explorer, ExplorerEvent} from "../../../../../../../explorer";
import {
  ProcessStatus,
  ProcessUnit,
  ToastData,
  ToastEvent
} from "../../../../../../../../global/vars";
import {usePreloader} from "../../../../../../../../modules/preloader/src/use-preloader";

@Component({
  selector: "start-process-action-renderer",
  standalone: true,
  templateUrl: "./start-process-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProcessService],
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
    TranslocoPipe
  ],
})
export class StartProcessActionRendererComponent extends AbstractExplorerActionRenderer
  implements OnInit {

  private readonly service = inject(ProcessService);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  get enabledCtrlValue() {
    return this.entityForm().controls.enabled.value as boolean;
  }

  get statusControlValue() {
    return this.entityForm().controls.status.value as ProcessStatus;
  }

  get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.entityForm().controls.status.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          this.cdr.markForCheck();
        });
    });
  }

  start() {
    this.service.start((this.data() as ProcessUnit).code).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      })
    ).subscribe(() => {
      this.store.emit(ExplorerEvent.ReloadObject);
    });
  }

}
