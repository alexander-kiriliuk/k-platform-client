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
import {ExplorerService, Explorer} from "../../../explorer";
import {ActivatedRoute, Params, QueryParamsHandling, Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";
import {BehaviorSubject, finalize, skip, Subscription, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TablePageEvent} from "primeng/table";
import {StringUtils} from "../../../../global/util";
import {Store} from "../../../../modules/store";
import {LocalizePipe} from "../../../../modules/locale";
import {
  PageableData,
  PageableParams,
  PlainObject,
  ToastData,
  DashboardEvent,
  ToastEvent
} from "../../../../global/vars";
import {PreloaderEvent} from "../../../../modules/preloader";
import parseParamsString = StringUtils.parseParamsString;
import stringifyParamsObject = StringUtils.stringifyParamsObject;

@Injectable()
export class SectionViewModel {

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

  get targetData() {
    return this._targetData();
  }

  get pageableData() {
    return this._pageableData();
  }

  get preloaderChannel() {
    return Explorer.SectionPreloaderCn;
  }

  get data() {
    return this.config?.data as SectionDialogConfig;
  }

  get multiselect() {
    return this.data?.multi;
  }

  get dialogMode() {
    return !!this.dialogRef;
  }

  get queryParams$() {
    return this.dialogMode ? this.paramsSub.asObservable() : this.ar.queryParams;
  }

  get queryParamsSnapshot(): Params {
    return this.dialogMode ? this.paramsSub.value : this.ar.snapshot.queryParams;
  }

  getItems(e: TablePageEvent) {
    const params = {} as PageableParams;
    Object.assign(params, this.queryParamsSnapshot);
    params.page = e.first / e.rows + 1;
    params.limit = e.rows;
    this.doNavigate(params, Object.keys(params).length ? "merge" : undefined);
  }

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

  removeSorting() {
    const queryParams = {...this.queryParamsSnapshot};
    delete queryParams.sort;
    delete queryParams.order;
    queryParams.page = 1;
    this.doNavigate(queryParams);
  }

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

  applySelectedRows() {
    const selectedRows = this.selectedRows();
    const res: unknown[] = [];
    for (const key in selectedRows) {
      res.push(selectedRows[key]);
    }
    this.dialogRef.close(res);
  }

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

  navToCreateNewItemUi() {
    const entity = this.targetData.entity;
    this.router.navigate([
      `/object/${entity.alias || entity.target}/${Explorer.NewItemToken}`
    ]);
  }

  getParsedFilter() {
    const filter = this.queryParamsSnapshot.filter;
    if (!filter) {
      return undefined;
    }
    return parseParamsString(filter);
  }

  private getSection(params?: PageableParams) {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.sectionSub?.unsubscribe();
    this.sectionSub = this.explorerService.getSectionList(this.target, params).pipe(
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
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

  private doNavigate(queryParams: Params, queryParamsHandling?: QueryParamsHandling) {
    if (this.dialogMode) {
      this.paramsSub.next(queryParams);
    } else {
      this.router.navigate([], {queryParams, queryParamsHandling});
    }
  }

}
