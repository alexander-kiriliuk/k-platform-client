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
import {
  ExplorerColumn,
  ObjectDialogConfig,
  SectionDialogConfig,
  TargetData
} from "../explorer.types";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Explorer, ExplorerService} from "../../../explorer";
import {ActivatedRoute, Params, QueryParamsHandling, Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";
import {BehaviorSubject, finalize, Observable, skip, Subscription, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TablePageEvent} from "primeng/table";
import {StringUtils} from "../../../../global/util";
import {Store} from "../../../../modules/store";
import {LocalizePipe} from "../../../../modules/locale";
import {
  DashboardEvent,
  PageableData,
  PageableParams,
  PlainObject,
  ToastData,
  ToastEvent
} from "../../../../global/vars";
import {usePreloader} from "../../../../modules/preloader/src/use-preloader";
import parseParamsString = StringUtils.parseParamsString;
import stringifyParamsObject = StringUtils.stringifyParamsObject;

/**
 * ViewModel for the Explorer Section Component.
 * This service handles the logic of the explorer section, including
 * state management for selected rows, navigation, and data retrieval.
 */
@Injectable()
export class ExplorerSectionViewModel {

  /**
   * A signal representing the currently selected rows.
   */
  readonly selectedRows = signal<{ [pk: string | number]: unknown }>({});

  private readonly dialogRef = inject(DynamicDialogRef, {optional: true});
  private readonly config = inject(DynamicDialogConfig, {optional: true});
  private readonly explorerService = inject(ExplorerService);
  private readonly store = inject(Store);
  private readonly ar = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialogService = inject(DialogService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly ts = inject(TranslocoService);
  private readonly paramsSub = new BehaviorSubject<Params>({});
  private readonly _targetData = signal<TargetData>(undefined);
  private readonly _pageableData = signal<PageableData>(undefined);
  private target: string;
  private sectionSub: Subscription;

  /**
   * Constructor for the ExplorerSectionViewModel.
   * Initializes the view model and subscribes to necessary services.
   */
  constructor() {
    if (this.data?.target) {
      this._targetData.set(this.data.target);
      this.target = this.targetData.entity.target;
    }
    if (!this.dialogMode) {
      this.ar.params.pipe(takeUntilDestroyed()).subscribe(v => {
        this.target = v.target;
        this.getTarget();
      });
    } else {
      this.getSection(this.data?.initialPageableParams);
    }
    this.queryParams$.pipe(skip(1), takeUntilDestroyed()).subscribe(v => {
      this.getSection(v as PageableParams);
    });
  }

  /**
   * Gets the target data.
   * @returns {TargetData} The target data.
   */
  get targetData(): TargetData {
    return this._targetData();
  }

  /**
   * Gets the pageable data.
   * @returns {PageableData} The pageable data.
   */
  get pageableData(): PageableData {
    return this._pageableData();
  }

  /**
   * Gets the preloader channel for the section.
   * @returns {string} The preloader channel.
   */
  get preloaderChannel(): string {
    return Explorer.SectionPreloaderCn;
  }

  /**
   * Gets the configuration data for the section.
   * @returns {SectionDialogConfig} The section configuration data.
   */
  get data(): SectionDialogConfig {
    return this.config?.data as SectionDialogConfig;
  }

  /**
   * Checks if multiselect is enabled.
   * @returns {boolean} True if multiselect is enabled, otherwise false.
   */
  get multiselect(): boolean {
    return this.data?.multi;
  }

  /**
   * Checks if the component view is in dialog mode.
   * @returns {boolean} True if in dialog mode, otherwise false.
   */
  get dialogMode(): boolean {
    return !!this.dialogRef;
  }

  /**
   * Gets the observable for query parameters.
   * @returns {Observable<Params>} The observable of query parameters.
   */
  get queryParams$(): Observable<Params> {
    return this.dialogMode ? this.paramsSub.asObservable() : this.ar.queryParams;
  }

  /**
   * Gets the snapshot of query parameters.
   * @returns {Params} The snapshot of query parameters.
   */
  get queryParamsSnapshot(): Params {
    return this.dialogMode ? this.paramsSub.value : this.ar.snapshot.queryParams;
  }

  /**
   * Gets items based on table pagination event.
   * @param e The pagination event.
   */
  getItems(e: TablePageEvent) {
    const params = {} as PageableParams;
    Object.assign(params, this.queryParamsSnapshot);
    params.page = e.first / e.rows + 1;
    params.limit = e.rows;
    this.doNavigate(params, Object.keys(params).length ? "merge" : undefined);
  }

  /**
   * Opens the filter dialog for a specific column.
   * @param column The column for which to show the filter dialog.
   */
  showFilterDialog(column: ExplorerColumn) {
    import("./filter/section-filter-dialog.component").then(c => {
      this.dialogService.open(c.SectionFilterDialogComponent, {
        header: this.ts.translate("explorer.filter.head", {
          v: this.localizePipe.transform(column.name, column.property)
        }),
        resizable: false,
        draggable: false,
        modal: true,
        position: "top",
        data: {
          column,
          paramsSnapshot: () => this.queryParamsSnapshot,
          navigate: (queryParams: Params, queryParamsHandling?: QueryParamsHandling) => {
            this.doNavigate(queryParams, queryParamsHandling);
          }
        }
      });
    });
  }

  /**
   * Removes sorting from the current query parameters.
   */
  removeSorting() {
    const queryParams = {...this.queryParamsSnapshot};
    delete queryParams.sort;
    delete queryParams.order;
    queryParams.page = 1;
    this.doNavigate(queryParams);
  }

  /**
   * Removes a filter from the specified property.
   * @param property The property from which to remove the filter.
   */
  removeFilter(property: string) {
    const queryParams = {...this.queryParamsSnapshot};
    queryParams.page = 1;
    const filter = parseParamsString(queryParams.filter);
    delete filter[property];
    if (Object.keys(filter).length) {
      queryParams.filter = stringifyParamsObject(filter);
    } else {
      delete queryParams.filter;
    }
    this.doNavigate(queryParams);
  }

  /**
   * Selects an entity and closes the dialog.
   * @param item The entity to select.
   */
  selectEntityAndCloseDialog(item: PlainObject) {
    if (!this.multiselect) {
      this.dialogRef.close(item);
      return;
    }
    const pk = item[this.targetData.primaryColumn.property] as string;
    const selectedRows = this.selectedRows();
    if (selectedRows[pk]) {
      delete selectedRows[pk];
    } else {
      selectedRows[pk] = item;
    }
    this.selectedRows.set({...selectedRows});
  }

  /**
   * Applies selected rows and closes the dialog.
   */
  applySelectedRows() {
    const selectedRows = this.selectedRows();
    const res: unknown[] = [];
    for (const key in selectedRows) {
      res.push(selectedRows[key]);
    }
    this.dialogRef.close(res);
  }

  /**
   * Opens the UI for a specific object.
   * @param item The object to open.
   */
  openObjectUi(item: { [pk: string | number]: unknown }) {
    const entity = this.targetData.entity;
    const id = item[this.targetData.primaryColumn.property];
    const title = this.localizePipe.transform(entity.name, entity.target) as string;
    if (this.dialogMode) {
      import("../object/explorer-object.component").then(m => {
        this.dialogService.open(m.ExplorerObjectComponent, {
          header: title + ` #${id}`,
          data: {target: this.target, id} as ObjectDialogConfig,
          modal: true,
          position: "top",
          maximizable: true,
          styleClass: "dialog-mode",
          width: "100vw",
        });
      });
      return;
    }
    this.router.navigate([
      `/object/${entity.alias || entity.target}/${id}`
    ]);
  }

  /**
   * Navigates to the UI for creating a new item.
   */
  navToCreateNewItemUi() {
    const entity = this.targetData.entity;
    this.router.navigate([
      `/object/${entity.alias || entity.target}/${Explorer.NewItemToken}`
    ]);
  }

  /**
   * Parses the current filters from the query parameters.
   * @returns {Record<string, string>} The parsed filters.
   */
  getParsedFilter(): Record<string, string> {
    const filter = this.queryParamsSnapshot.filter;
    if (!filter) {
      return undefined;
    }
    return parseParamsString(filter);
  }

  /**
   * Retrieves the section data based on the given parameters.
   * @param params Optional parameters for the section query.
   */
  private getSection(params?: PageableParams) {
    this.sectionSub?.unsubscribe();
    this.sectionSub = this.explorerService.getSectionList(this.target, params).pipe(
      usePreloader(this.store, this.preloaderChannel),
      finalize(() => {
        if (this.dialogMode) {
          return;
        }
        this.store.emit<string>(DashboardEvent.PatchHeader, this.ts.translate("explorer.title", {
          count: this.pageableData?.totalCount,
          name: this.localizePipe.transform(this.targetData.entity.name, this.targetData.entity.target)
        }));
      }),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(v => {
      this._pageableData.set(v);
    });
  }

  /**
   * Retrieves target data based on the current configuration.
   */
  private getTarget() {
    this._pageableData.set(undefined);
    this._targetData.set(undefined);
    this.explorerService.getTarget(this.target, "section").pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(v => {
      this._targetData.set(v);
      this.getSection(this.queryParamsSnapshot as PageableParams);
    });
  }

  /**
   * Navigates to a specific query parameter state.
   * @param queryParams The query parameters to navigate to.
   * @param queryParamsHandling Optional handling of query parameters.
   */
  private doNavigate(queryParams: Params, queryParamsHandling?: QueryParamsHandling) {
    if (this.dialogMode) {
      this.paramsSub.next(queryParams);
    } else {
      this.router.navigate([], {queryParams, queryParamsHandling});
    }
  }

}
