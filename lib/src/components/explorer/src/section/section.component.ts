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

import {ChangeDetectionStrategy, Component, HostBinding, inject} from "@angular/core";
import {ExplorerService} from "../explorer.service";
import {TableModule} from "primeng/table";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe} from "@ngneat/transloco";
import {NgClass} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {ExplorerSectionRendererComponent} from "../renderer/explorer-section-renderer.component";
import {ExplorerActionRendererComponent} from "../renderer/explorer-action-renderer.component";
import {SectionViewModel} from "./section.view-model";
import {PreloaderComponent, PreloaderDirective} from "../../../../modules/preloader";
import {LocalizePipe} from "../../../../modules/locale";
import {StopPropagationDirective} from "../../../../modules/events";
import {PlainObject} from "../../../../global/vars";

@Component({
  selector: "section",
  standalone: true,
  templateUrl: "./section.component.html",
  styleUrls: ["./section.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PreloaderComponent,
    PreloaderDirective,
    TableModule,
    LocalizePipe,
    RippleModule,
    NgClass,
    TranslocoPipe,
    ButtonModule,
    ExplorerSectionRendererComponent,
    ExplorerActionRendererComponent,
    StopPropagationDirective,
  ],
  providers: [
    SectionViewModel,
    ExplorerService
  ]
})
export class SectionComponent {

  readonly vm = inject(SectionViewModel);

  @HostBinding("class.dialogMode")
  get cssClass() {
    return this.vm.dialogMode;
  }

  get selectedRowsCount() {
    return Object.keys(this.vm.selectedRows()).length;
  }

  get scrollHeight() {
    return this.vm.dialogMode ? undefined : "calc(100vh - var(--header-bar-h) - var(--paginator-h))";
  }

  get currentPos() {
    return ((this.vm.pageableData?.currentPage ?? 1) - 1) * (this.vm.pageableData?.pageSize ?? 0);
  }

  isSelected(item: PlainObject) {
    if (!this.vm.multiselect) {
      return false;
    }
    const pk = item[this.vm.targetData.primaryColumn.property] as string;
    return this.vm.selectedRows()[pk] !== undefined;
  }

  propertyFilter(propName: string) {
    const filterObject = this.vm.getParsedFilter();
    if (!filterObject || !filterObject[propName]) {
      return undefined;
    }
    return filterObject[propName];
  }

}
