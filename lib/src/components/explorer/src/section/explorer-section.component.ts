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
import {ExplorerSectionViewModel} from "./explorer-section-view-model.service";
import {PreloaderComponent, PreloaderDirective} from "../../../../modules/preloader";
import {LocalizePipe} from "../../../../modules/locale";
import {StopPropagationDirective} from "../../../../modules/events";
import {PlainObject} from "../../../../global/vars";

/**
 * This component is responsible for rendering the explorer section UI,
 * managing the state of selected rows, and providing methods for
 * navigation and filtering of the displayed data.
 */
@Component({
  selector: "section",
  standalone: true,
  templateUrl: "./explorer-section.component.html",
  styleUrls: ["./explorer-section.component.scss"],
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
    ExplorerSectionViewModel,
    ExplorerService
  ]
})
export class ExplorerSectionComponent {

  /**
   * ViewModel for the explorer section component.
   */
  readonly vm = inject(ExplorerSectionViewModel);

  /**
   * Class binding for dialog mode.
   * @returns {boolean} Indicates if the component is in dialog mode.
   */
  @HostBinding("class.dialogMode")
  get cssClass(): boolean {
    return this.vm.dialogMode;
  }

  /**
   * Gets the count of selected rows.
   * @returns {number} The count of selected rows.
   */
  get selectedRowsCount(): number {
    return Object.keys(this.vm.selectedRows()).length;
  }

  /**
   * Gets the scroll height of the section.
   * @returns {string | undefined} The calculated height based on dialog mode.
   */
  get scrollHeight(): string {
    return this.vm.dialogMode ? undefined : "calc(100vh - var(--header-bar-h) - var(--paginator-h))";
  }

  /**
   * Gets the current position in the paginated data.
   * @returns {number} The current position.
   */
  get currentPos(): number {
    return ((this.vm.pageableData?.currentPage ?? 1) - 1) * (this.vm.pageableData?.pageSize ?? 0);
  }

  /**
   * Checks if an item is selected.
   * @param item The item to check for selection.
   * @returns {boolean} True if the item is selected, otherwise false.
   */
  isSelected(item: PlainObject): boolean {
    if (!this.vm.multiselect) {
      return false;
    }
    const pk = item[this.vm.targetData.primaryColumn.property] as string;
    return this.vm.selectedRows()[pk] !== undefined;
  }

  /**
   * Gets the filter value for a specified property.
   * @param propName The name of the property to filter by.
   * @returns {string | undefined} The filter value or undefined if not set.
   */
  propertyFilter(propName: string): string {
    const filterObject = this.vm.getParsedFilter();
    if (!filterObject || !filterObject[propName]) {
      return undefined;
    }
    return filterObject[propName];
  }

}
