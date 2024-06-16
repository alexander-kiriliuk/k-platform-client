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
import {NgClass} from "@angular/common";
import {catchError} from "rxjs/operators";
import {finalize, throwError} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProcessService} from "../../../../../../../../global/service";
import {
  AbstractExplorerActionRenderer
} from "../../../../default/abstract-explorer-action-renderer";
import {Store} from "../../../../../../../../modules/store";
import {ExplorerEvent, Explorer} from "../../../../../../../explorer";
import {PreloaderEvent} from "../../../../../../../../modules/preloader";
import {ToastEvent, ProcessUnit, ToastData} from "../../../../../../../../global/vars";

@Component({
  selector: "toggle-process-action-renderer",
  standalone: true,
  templateUrl: "./toggle-process-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProcessService],
  imports: [
    RippleModule,
    ButtonModule,
    TranslocoPipe,
    NgClass
  ],
})
export class ToggleProcessActionRendererComponent extends AbstractExplorerActionRenderer
  implements OnInit {

  private readonly service = inject(ProcessService);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  get enabledCtrlValue() {
    return this.entityForm().controls.enabled.value as boolean;
  }

  get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.entityForm().controls.enabled.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          this.cdr.markForCheck();
        });
    });
  }

  toggle() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.service.toggle((this.data() as ProcessUnit).code).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
      }),
    ).subscribe(() => {
      this.store.emit(ExplorerEvent.ReloadObject);
    });
  }

}
