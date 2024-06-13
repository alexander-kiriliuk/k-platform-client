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
import {LocalizePipe} from "../../../modules/locale/localize.pipe";
import {PreloaderComponent} from "../../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../../modules/preloader/preloader.directive";
import {DEVICE} from "../../../modules/device/device.constants";
import {CurrentUser} from "../../../global/service/current-user";
import {Roles} from "../../../global/constants";

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

  activeTabIndex = 0;
  readonly vm = inject(ExplorerObjectViewModel);
  readonly device = inject(DEVICE);
  private readonly currentUser = inject(CurrentUser);

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

  get canExport() {
    if (!this.vm.canDeleteObject) {
      return false;
    }
    return this.currentUser.hasSomeRole(Roles.ADMIN);
  }

  get canDuplicate() {
    return !this.vm.duplicateId && this.vm.targetData.entity.defaultActionDuplicate;
  }

  ngOnInit(): void {
    this.vm.initObject();
  }

  navBack() {
    history.back();
  }

  hasColumns(tab: ExplorerTab) {
    return this.vm.targetData.entity.columns.find(v => v.tab.id === tab.id);
  }

  exportObject() {
    import("../../xdb/xdb-export/xdb-export-dialog.component").then(c =>
      this.vm.dialogService.open(c.XdbExportDialogComponent, this.vm.exportDialogConfig));
  }

  duplicateObject() {
    const p1 = this.vm.entityTargetOrAlias;
    const prop = this.vm.targetData.primaryColumn.property;
    const url = `/object/${p1}/${NewItemToken}?${DuplicateItemToken}=${this.vm.entityData[prop]}`;
    window.open(url, "_blank");
  }

}
