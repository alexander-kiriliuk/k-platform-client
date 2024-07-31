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
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ActivatedRoute, Router} from "@angular/router";
import {ExplorerService} from "../explorer.service";
import {FormBuilder, FormControl} from "@angular/forms";
import {TranslocoService} from "@ngneat/transloco";
import {ConfirmationService} from "primeng/api";
import {ExplorerObject} from "./explorer-object.constants";
import {ExplorerObjectDto, ExplorerTab, ObjectDialogConfig, TargetData} from "../explorer.types";
import {ExplorerEvent} from "./explorer.event";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Explorer} from "../explorer.constants";
import {forkJoin, of, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {LocalizePipe} from "../../../../modules/locale";
import {Store, StoreMessage} from "../../../../modules/store";
import {XdbExportDialogParams} from "../../../xdb";
import {DashboardEvent, ToastData, ToastEvent} from "../../../../global/vars";
import {usePreloader} from "../../../../modules/preloader/src/use-preloader";
import DuplicateItemToken = Explorer.DuplicateItemToken;

@Injectable()
export class ExplorerObjectViewModel {

  readonly dialogService = inject(DialogService);
  private readonly dialogRef = inject(DynamicDialogRef, {optional: true});
  private readonly config = inject(DynamicDialogConfig, {optional: true});
  private readonly ar = inject(ActivatedRoute);
  private readonly explorerService = inject(ExplorerService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly ts = inject(TranslocoService);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);
  readonly entityForm = this.fb.group({});
  readonly restTab = ExplorerObject.RestTab;
  readonly actionsDialogVisibility = signal<boolean>(undefined);
  private readonly _targetData = signal<TargetData>(undefined);
  private readonly _entityData = signal<{ [k: string]: unknown }>(undefined);
  private readonly _tabs = signal<ExplorerTab[]>([]);

  constructor() {
    this.store.on<ExplorerObjectDto>(ExplorerEvent.SaveObject).pipe(takeUntilDestroyed())
      .subscribe(data => this.handleSaveEvent(data));
    this.store.on<ExplorerObjectDto>(ExplorerEvent.DeleteObject).pipe(takeUntilDestroyed())
      .subscribe(data => this.handleDeleteEvent(data));
    this.store.on<void>(ExplorerEvent.ReloadObject).pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.actionsDialogVisibility.set(false);
        this._tabs.set([]);
        this.initObject();
      });
  }

  private get data() {
    return this.config?.data as ObjectDialogConfig;
  }

  get entityTargetOrAlias() {
    return this.targetData.entity.alias || this.targetData.entity.target;
  }

  get targetData() {
    return this._targetData();
  }

  get entityData() {
    return this._entityData();
  }

  get tabs() {
    return this._tabs();
  }

  get exportDialogConfig(): DynamicDialogConfig {
    return {
      header: this.ts.translate("explorer.export.label"),
      data: {target: this.targetData, entity: this.entityData} as XdbExportDialogParams,
      modal: true,
      position: "center"
    };
  }

  get dialogMode() {
    return !!this.dialogRef;
  }

  get id() {
    return this.dialogMode ? this.data.id : this.ar.snapshot.params.id;
  }

  get duplicateId() {
    return this.dialogMode ? undefined : this.ar.snapshot.queryParams[DuplicateItemToken];
  }

  get target() {
    return this.dialogMode ? this.data.target : this.ar.snapshot.params.target;
  }

  get preloaderChannel() {
    return Explorer.ObjectPreloaderCn;
  }

  get canDeleteObject() {
    if (!this.entityData) {
      return false;
    }
    return this.entityData[this.targetData?.primaryColumn?.property];
  }

  saveObject() {
    const id = this.id === Explorer.NewItemToken ?
      undefined : this.entityData[this.targetData.primaryColumn.property] as number;
    this.store.emit<ExplorerObjectDto>(ExplorerEvent.SaveObject, {
      id,
      target: this.targetData.entity.target,
      entity: this.entityForm.getRawValue()
    });
  }

  deleteObject() {
    this.confirmationService.confirm({
      accept: () => {
        this.store.emit<ExplorerObjectDto>(ExplorerEvent.DeleteObject, {
          id: this.entityData[this.targetData.primaryColumn.property] as number,
          target: this.targetData.entity.target,
        });
      }
    });
  }

  initObject() {
    const targetObs = this.explorerService.getTarget(this.target, "object");
    const entityObs = this.explorerService.getEntity<{ [k: string]: unknown }>(
      this.target, this.duplicateId ?? this.id
    );
    forkJoin({
      target: targetObs,
      entity: this.id === Explorer.NewItemToken && !this.duplicateId ? of(null) : entityObs
    }).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(payload => this.handleReceivedTargetData(payload));
  }

  private handleReceivedTargetData(payload: { entity: { [k: string]: unknown }; target: TargetData }) {
    if (payload?.entity && this.duplicateId) {
      delete payload.entity[payload.target.primaryColumn.property];
    }
    this._targetData.set(payload.target);
    this._entityData.set(payload.entity);
    let title = this.localizePipe.transform(
      this.targetData.entity.name, this.targetData.entity.target
    ) as string;
    if (this.entityData && !this.duplicateId) {
      title += ` #${this.entityData[this.targetData.primaryColumn.property]}`;
    } else {
      title += " #new";
    }
    if (!this.dialogMode) {
      this.store.emit<string>(DashboardEvent.PatchHeader, title);
    }
    const tabs: ExplorerTab[] = [];
    for (const col of this.targetData.entity.columns) {
      if (!col.tab) {
        col.tab = this.restTab;
        continue;
      }
      if (tabs.find(t => t.id === col.tab?.id)) {
        continue;
      }
      tabs.push(col.tab);
    }
    tabs.push(this.restTab);
    this._tabs.set(tabs);
    this.targetData.entity.columns.forEach(col => this.entityForm.addControl(
      col.property, new FormControl(this.entityData ? this.entityData[col.property] : undefined))
    );
    this.entityForm.patchValue(this.entityData);
  }

  private handleSaveEvent(data: StoreMessage<ExplorerObjectDto>) {
    this.actionsDialogVisibility.set(false);
    this.explorerService.saveEntity(data.payload.entity, data.payload.target, data.payload.id).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe((entity) => {
      this.store.emit<ToastData>(ToastEvent.Success, {
        title: this.ts.translate("explorer.msg.object.save.success")
      });
      if (this.id === Explorer.NewItemToken) {
        const p1 = this.entityTargetOrAlias;
        this.router.navigate([
          `/object/${p1}/${(entity as { [k: string]: unknown })[this.targetData.primaryColumn.property]}`
        ], {replaceUrl: true});
      }
    });
  }

  private handleDeleteEvent(data: StoreMessage<ExplorerObjectDto>) {
    this.actionsDialogVisibility.set(false);
    this.explorerService.removeEntity(data.payload.target, data.payload.id).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: res.error.message, message: res.error.statusCode
        });
        return throwError(() => res);
      })
    ).subscribe(() => {
      this.store.emit<ToastData>(ToastEvent.Success, {
        title: this.ts.translate("explorer.msg.object.delete.success")
      });
      this.router.navigate([
        `/section/${this.entityTargetOrAlias}`
      ], {replaceUrl: true});
    });
  }

}
