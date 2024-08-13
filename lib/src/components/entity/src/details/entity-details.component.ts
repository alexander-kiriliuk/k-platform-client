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
import {DialogService} from "primeng/dynamicdialog";
import {AsyncPipe, NgClass} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe} from "@ngneat/transloco";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CheckboxModule} from "primeng/checkbox";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {EntityDetails} from "./entity-details.constants";
import {PreloaderComponent, PreloaderDirective} from "../../../../modules/preloader";
import {LocalizePipe, LocalizeStringInputComponent} from "../../../../modules/locale";
import {MediaInputComponent} from "../../../../modules/media";
import {RefInputComponent} from "../../../../modules/ref-input";
import {EntityDetailsViewModel} from "./entity-details.view-model";
import {Store} from "../../../../modules/store";
import {ExplorerService, TargetData} from "../../../../components/explorer";
import {usePreloader} from "../../../../modules/preloader/src/use-preloader";
import createColumnForm = EntityDetails.createColumnForm;

/**
 * Component for managing and displaying the details of an entity.
 */
@Component({
  selector: "entity-details",
  standalone: true,
  templateUrl: "./entity-details.component.html",
  styleUrls: ["./entity-details.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PreloaderComponent,
    PreloaderDirective,
    AsyncPipe,
    LocalizePipe,
    InputTextModule,
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonModule,
    LocalizeStringInputComponent,
    ConfirmDialogModule,
    NgClass,
    MediaInputComponent,
    InputNumberModule,
    InputTextareaModule,
    RefInputComponent,
    CheckboxModule,
  ],
  providers: [
    EntityDetailsViewModel,
    DialogService,
    ExplorerService,
    ConfirmationService
  ]
})
export class EntityDetailsComponent {

  /** Observable for the target data. **/
  readonly target$: Observable<TargetData>;
  readonly vm = inject(EntityDetailsViewModel);
  private readonly explorerService = inject(ExplorerService);
  private readonly store = inject(Store);

  /**
   * Sets up initial state and loads the target data.
   */
  constructor() {
    this.target$ = this.explorerService.getTarget(this.vm.target).pipe(
      usePreloader(this.store, this.vm.preloaderChannel),
      map(target => {
        this.vm.targetForm.patchValue(target.entity);
        target.entity.columns.forEach(col => this.vm.targetForm.controls.columns.push(createColumnForm(col)));
        return target;
      }),
    );
  }

}
