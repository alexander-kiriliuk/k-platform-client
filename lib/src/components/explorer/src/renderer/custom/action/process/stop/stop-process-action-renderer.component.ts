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
  InputSignal,
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
import {
  ProcessStatus,
  ProcessUnit,
  ToastData,
  ToastEvent
} from "../../../../../../../../global/vars";
import {Explorer, ExplorerEvent} from "../../../../../../../explorer";
import {usePreloader} from "../../../../../../../../modules/preloader/src/use-preloader";
import {FormControl, FormGroup} from "@angular/forms";

/**
 * This component allows users to stop a running process and handle the action state.
 */
@Component({
  selector: "stop-process-action-renderer",
  standalone: true,
  templateUrl: "./stop-process-action-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProcessService],
  imports: [
    RippleModule,
    ButtonModule,
    LocalizePipe,
    TranslocoPipe
  ],
})
export class StopProcessActionRendererComponent extends AbstractExplorerActionRenderer
  implements OnInit {

  override entityForm: InputSignal<FormGroup<{ [K in keyof ProcessUnit]: FormControl<ProcessUnit[K]> }>>;
  private readonly service = inject(ProcessService);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly injector = inject(Injector);

  /**
   * Gets the value of the enabled control from the entity form.
   * @returns The enabled control value.
   */
  get enabledCtrlValue() {
    return this.entityForm().controls.enabled.value;
  }

  /**
   * Gets the current status control value from the entity form.
   * @returns The current status of the process.
   */
  get statusControlValue() {
    return this.entityForm().controls.status.value;
  }

  /**
   * Gets the channel for the preloader.
   * @returns The preloader channel identifier.
   */
  get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  /**
   * Initializes the component and subscribes to control value changes.
   */
  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      this.entityForm().controls.status.valueChanges
        .pipe(takeUntilDestroyed())
        .subscribe(() => {
          this.cdr.markForCheck();
        });
    });
  }

  /**
   * Stops the associated process.
   */
  stop() {
    this.service.stop((this.data() as ProcessUnit).code).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
    ).subscribe(() => {
      this.store.emit(ExplorerEvent.ReloadObject);
    });
  }

}
