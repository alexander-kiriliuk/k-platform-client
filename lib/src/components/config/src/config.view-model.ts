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

import {inject, Injectable, signal} from "@angular/core";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {debounceTime, distinctUntilChanged, throwError} from "rxjs";
import {TablePageEvent} from "primeng/table";
import {catchError} from "rxjs/operators";
import {TranslocoService} from "@ngneat/transloco";
import {DialogService} from "primeng/dynamicdialog";
import {FormControl} from "@angular/forms";
import {
  DashboardEvent,
  PageableData,
  PageableParams,
  ToastData,
  ToastEvent
} from "../../../global/vars";
import {ConfigItem, ConfigPropertyEditorResult} from "./config.types";
import {Store} from "../../../modules/store";
import {ConfigService} from "./config.service";
import {Config} from "./config.constants";
import {usePreloader} from "../../../modules/preloader/src/use-preloader";


/**
 * ViewModel for the configuration component. Handles data retrieval, search functionality,
 * and property editing.
 */
@Injectable()
export class ConfigViewModel {

  /** Signal containing pageable configuration data */
  readonly pageableData = signal<PageableData<ConfigItem>>(undefined);
  /** Form control for search input */
  readonly searchCtrl: FormControl<string> = new FormControl();

  private readonly ts = inject(TranslocoService);
  private readonly store = inject(Store);
  private readonly configService = inject(ConfigService);
  private readonly dialogService = inject(DialogService);

  /**
   * Constructor initializes the search control and subscribes to its value changes.
   * Also sets the header title and retrieves initial data.
   */
  constructor() {
    this.searchCtrl.valueChanges.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.getData();
    });
    this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("config.title"));
    this.getData();
  }

  get preloaderChannel() {
    return Config.PreloaderCn;
  }

  /** Calculates the current position in the pageable data */
  get currentPos() {
    return ((this.pageableData()?.currentPage ?? 1) - 1) * (this.pageableData()?.pageSize ?? 0);
  }

  /**
   * Retrieves configuration data based on pagination and search parameters.
   * @param e Optional table page event for pagination
   */
  getData(e?: TablePageEvent) {
    const params = {} as PageableParams;
    if (this.searchCtrl.value) {
      params.filter = this.searchCtrl.value;
    }
    if (e) {
      params.page = e.first / e.rows + 1;
      params.limit = e.rows;
    }
    this.configService.pageableData(params).pipe(
      usePreloader(this.store, this.preloaderChannel),
    ).subscribe(payload => {
      this.pageableData.set(payload);
    });
  }

  /**
   * Opens the property editor dialog for adding or editing a configuration property.
   * @param item Optional configuration item to edit
   */
  openPropertyEditor(item?: ConfigItem) {
    import("./editor/config-property-editor.component").then(c => {
      this.dialogService.open(c.ConfigPropertyEditorComponent, {
        header: this.ts.translate("config.header"),
        resizable: false,
        draggable: false,
        modal: true,
        position: "center",
        data: item
      }).onClose.subscribe((res: ConfigPropertyEditorResult) => {
        if (!res) {
          return;
        }
        switch (res.cmd) {
        case "delete":
          this.deleteProperty(res.data);
          break;
        case "save":
          this.saveProperty(res.data);
          break;
        }
      });
    });
  }

  /**
   * Deletes a configuration property and updates the pageable data.
   * @param data Configuration item to delete
   */
  private deleteProperty(data: ConfigItem) {
    this.configService.removeProperty(data.key).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      })
    ).subscribe(() => {
      const payload = this.pageableData();
      const idx = payload.items.findIndex(v => v.key === data.key);
      payload.items.splice(idx, 1);
      this.pageableData.set({...payload});
      this.store.emit<ToastData>(ToastEvent.Success, {message: this.ts.translate("config.property.deleted")});
    });
  }

  /**
   * Saves a configuration property and updates the pageable data.
   * @param data Configuration item to save
   */
  private saveProperty(data: ConfigItem) {
    this.configService.setProperty(data).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      }),
    ).subscribe(() => {
      const payload = this.pageableData();
      const idx = payload.items.findIndex(v => v.key === data.key);
      if (idx !== -1) {
        payload.items.splice(idx, 1);
      }
      payload.items.unshift(data);
      this.pageableData.set({...payload});
      this.store.emit<ToastData>(ToastEvent.Success, {message: this.ts.translate("config.property.saved")});
    });
  }

}
