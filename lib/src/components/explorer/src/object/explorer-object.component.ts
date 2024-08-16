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

import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {ExplorerService} from "../explorer.service";
import {ExplorerObjectRendererComponent} from "../renderer/explorer-object-renderer.component";
import {NgClass, NgTemplateOutlet} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TabViewModule} from "primeng/tabview";
import {TranslocoPipe} from "@ngneat/transloco";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InputTextModule} from "primeng/inputtext";
import {ExplorerActionRendererComponent} from "../renderer/explorer-action-renderer.component";
import {TooltipModule} from "primeng/tooltip";
import {DialogModule} from "primeng/dialog";
import {ExplorerObjectViewModel} from "./explorer-object.view-model";
import {ExplorerTab, ExplorerTabSize} from "../explorer.types";
import {Explorer} from "../explorer.constants";
import NewItemToken = Explorer.NewItemToken;
import DuplicateItemToken = Explorer.DuplicateItemToken;
import {LocalizePipe} from "../../../../modules/locale";
import {PreloaderDirective, PreloaderComponent} from "../../../../modules/preloader";
import {DEVICE} from "../../../../modules/device";
import {CurrentUser} from "../../../../global/service";
import {Roles} from "../../../../global/vars";

/**
 * A component that represents an explorer object in the application.
 * This component provides functionality for viewing, editing,
 * duplicating, and deleting objects within an explorer interface.
 * It utilizes a ViewModel to manage state and communicate with services.
 */
@Component({
  selector: "explorer-object",
  standalone: true,
  templateUrl: "./explorer-object.component.html",
  styleUrls: ["./explorer-object.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ExplorerObjectViewModel,
    ExplorerService,
    LocalizePipe,
    ConfirmationService
  ],
  imports: [
    ExplorerObjectRendererComponent,
    TabViewModule,
    TranslocoPipe,
    NgClass,
    ButtonModule,
    RippleModule,
    PreloaderComponent,
    PreloaderDirective,
    LocalizePipe,
    ConfirmDialogModule,
    InputTextModule,
    ReactiveFormsModule,
    ExplorerActionRendererComponent,
    TooltipModule,
    NgTemplateOutlet,
    DialogModule,
  ],
})
export class ExplorerObjectComponent implements OnInit {

  /** The index of the currently active tab. */
  activeTabIndex = 0;
  /** The ViewModel instance for managing state and logic. */
  readonly vm = inject(ExplorerObjectViewModel);
  readonly device = inject(DEVICE);
  private readonly currentUser = inject(CurrentUser);

  /**
   * Returns the CSS class name for the current tab based on its size.
   * This getter computes the class name for responsive design based on
   * the current device type (desktop or tablet) and the size of the active tab.
   * @returns The CSS class name for the active tab, or null if not applicable.
   */
  get tabClassName() {
    const tabSize = this.vm.tabs[this.activeTabIndex]?.size;
    if (!tabSize) {
      return null;
    }
    const key: keyof ExplorerTabSize = this.device.isDesktop ? "desktop" : this.device.isTablet ? "tablet" : null;
    if (!key) {
      return null;
    }
    return `col-${tabSize[key]}`;
  }

  /**
   * Checks if the current user has the ability to export the object.
   * The user can export the object if they have permission to delete
   * the object and have an ADMIN role.
   * @returns {boolean} True if the user can export, otherwise false.
   */
  get canExport(): boolean {
    if (!this.vm.canDeleteObject) {
      return false;
    }
    return this.currentUser.hasSomeRole(Roles.ADMIN);
  }

  /**
   * Initializes the component when it is created.
   * This lifecycle method is called once the component has been initialized.
   * It triggers the ViewModel to initialize the object being explored.
   */
  ngOnInit(): void {
    this.vm.initObject();
  }

  /**
   * Navigates back to the previous page in the history stack.
   * This method is typically used to allow users to return to the
   * previous view without having to implement custom navigation logic.
   */
  navBack() {
    history.back();
  }

  /**
   * Checks if the specified tab has columns associated with it.
   * This method checks if there are any columns in the target data entity
   * that belong to the provided tab.
   * @param {ExplorerTab} tab - The tab to check for associated columns.
   * @returns Column if the tab has columns.
   */
  hasColumns(tab: ExplorerTab) {
    return this.vm.targetData.entity.columns.find(v => v.tab.id === tab.id);
  }

  /**
   * Initiates the export process for the object.
   * This method dynamically imports the XdbExportDialogComponent
   * and opens it with the necessary configuration from the ViewModel.
   */
  exportObject() {
    import("../../../xdb").then(c =>
      this.vm.dialogService.open(c.XdbExportDialogComponent, this.vm.exportDialogConfig));
  }

  /**
   * Duplicates the current object and opens it in a new tab.
   * This method constructs a URL for the new object based on the
   * current object's properties and opens it in a new browser tab.
   */
  duplicateObject() {
    const p1 = this.vm.entityTargetOrAlias;
    const prop = this.vm.targetData.primaryColumn.property;
    const url = `/object/${p1}/${NewItemToken}?${DuplicateItemToken}=${this.vm.entityData[prop]}`;
    window.open(url, "_blank");
  }

}
