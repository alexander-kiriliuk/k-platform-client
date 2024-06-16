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
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextModule} from "primeng/inputtext";
import {DatePipe, NgClass, NgTemplateOutlet} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {ExplorerService} from "../../explorer.service";
import {InputNumberModule} from "primeng/inputnumber";
import {CalendarModule} from "primeng/calendar";
import {PreloaderComponent, PreloaderDirective} from "../../../../../modules/preloader";
import {LocalizePipe} from "../../../../../modules/locale";
import {SectionFilterDialogViewModel} from "./section-filter-dialog.view-model";
import {CurrentUser} from "../../../../../global/service";
import {SortOrder} from "../../../../../global/vars";


@Component({
  selector: "section-filter-dialog",
  standalone: true,
  templateUrl: "./section-filter-dialog.component.html",
  styleUrls: ["./section-filter-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoPipe,
    InputTextModule,
    NgClass,
    ButtonModule,
    ReactiveFormsModule,
    CheckboxModule,
    PreloaderComponent,
    PreloaderDirective,
    InputNumberModule,
    CalendarModule,
    NgTemplateOutlet,
    LocalizePipe
  ],
  providers: [
    SectionFilterDialogViewModel,
    ExplorerService,
    DatePipe,
    DialogService
  ]
})
export class SectionFilterDialogComponent {

  private readonly datePipe = inject(DatePipe);
  private readonly currentUser = inject(CurrentUser);
  readonly vm = inject(SectionFilterDialogViewModel);

  get isSortAscActive() {
    return this.vm.queryParamsSnapshot.sort === this.vm.column.property
      && (this.vm.queryParamsSnapshot.order as SortOrder) === "ASC";
  }

  get isSortDescActive() {
    return this.vm.queryParamsSnapshot.sort === this.vm.column.property
      && (this.vm.queryParamsSnapshot.order as SortOrder) === "DESC";
  }

  get applyButtonEnabled() {
    if (this.vm.column.type === "date") {
      for (const v of (this.vm.form.value.value as Date[])) {
        if (v === null) {
          return false;
        }
      }
    }
    return this.vm.form.valid;
  }

  get currentDataValue() {
    const dates = this.vm.form.controls.value.value as Date[];
    if (!dates?.length) {
      return undefined;
    }
    let res = "";
    const format = this.currentUser.config.fullDateFormat;
    res += this.datePipe.transform(dates[0], format);
    if (dates[1]) {
      res += " - " + this.datePipe.transform(dates[1], format);
    }
    return res;
  }

}
