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

/**
 * ViewModel for the ExplorerObject component.
 * This ViewModel manages the logic and state for the ExplorerObjectComponent,
 * handling operations such as saving, deleting, and initializing objects.
 */
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
  /** The form used for the entity. */
  readonly entityForm = this.fb.group({});
  readonly restTab = ExplorerObject.RestTab;
  /** Visibility state of action dialogs. */
  readonly actionsDialogVisibility = signal<boolean>(undefined);
  /** Signal for storing target data. */
  private readonly _targetData = signal<TargetData>(undefined);
  /** Signal for storing entity data. */
  private readonly _entityData = signal<{ [k: string]: unknown }>(undefined);
  /** Signal for storing the tabs associated with the entity. */
  private readonly _tabs = signal<ExplorerTab[]>([]);

  /**
   * Initializes the ViewModel by subscribing to relevant store events.
   */
  constructor() {
    // Subscribe to store events for object save, delete, and reload actions
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

  /** Gets the data configuration from the dynamic dialog. */
  private get data() {
    return this.config?.data as ObjectDialogConfig;
  }

  /**
   * Retrieves the target entity or alias for the current object.
   * @returns {string} The target entity or alias.
   */
  get entityTargetOrAlias(): string {
    return this.targetData.entity.alias || this.targetData.entity.target;
  }

  /**
   * Retrieves the target data for the current object.
   * @returns {TargetData} The target data.
   */
  get targetData(): TargetData {
    return this._targetData();
  }

  /**
   * Retrieves the entity data for the current object.
   * @returns The entity data.
   */
  get entityData() {
    return this._entityData();
  }

  /**
   * Retrieves the tabs associated with the current object.
   * @returns {ExplorerTab[]} The array of tabs.
   */
  get tabs(): ExplorerTab[] {
    return this._tabs();
  }

  /**
   * Configuration for the export dialog.
   * @returns {DynamicDialogConfig} The configuration object for the export dialog.
   */
  get exportDialogConfig(): DynamicDialogConfig {
    return {
      header: this.ts.translate("explorer.export.label"),
      data: {target: this.targetData, entity: this.entityData} as XdbExportDialogParams,
      modal: true,
      position: "center"
    };
  }

  /**
   * Checks if the object can be duplicated.
   * The object can be duplicated if there is no existing duplicate ID
   * and if the default action for duplication is enabled.
   * @returns {boolean} True if the object can be duplicated, otherwise false.
   */
  get canDuplicate(): boolean {
    return this.id !== Explorer.NewItemToken && !this.duplicateId
      && this.targetData.entity.defaultActionDuplicate;
  }

  /**
   * Indicates whether the ViewModel is operating in dialog mode.
   * @returns {boolean} True if in dialog mode, otherwise false.
   */
  get dialogMode(): boolean {
    return !!this.dialogRef;
  }

  /**
   * Retrieves the ID for the current object.
   * @returns The ID of the object or undefined.
   */
  get id() {
    return this.dialogMode ? this.data.id : this.ar.snapshot.params.id;
  }

  /**
   * Retrieves the duplicate ID if in dialog mode.
   * @returns The duplicate ID or undefined.
   */
  get duplicateId() {
    return this.dialogMode ? undefined : this.ar.snapshot.queryParams[DuplicateItemToken];
  }

  /**
   * Retrieves the target for the current object.
   * @returns {string} The target string.
   */
  get target(): string {
    return this.dialogMode ? this.data.target : this.ar.snapshot.params.target;
  }

  /**
   * Returns the channel identifier for the preloader.
   * @returns {string} The preloader channel identifier.
   */
  get preloaderChannel(): string {
    return Explorer.ObjectPreloaderCn;
  }

  /**
   * Checks if the current user can delete the object.
   * @returns primary column property if the user can delete the object, otherwise false.
   */
  get canDeleteObject() {
    if (!this.entityData) {
      return false;
    }
    return this.entityData[this.targetData?.primaryColumn?.property];
  }

  /**
   * Saves the current object state to the store.
   * This method triggers a save event in the store with the current
   * entity data and its target.
   */
  saveObject() {
    const id = this.id === Explorer.NewItemToken ?
      undefined : this.entityData[this.targetData.primaryColumn.property] as number;
    this.store.emit<ExplorerObjectDto>(ExplorerEvent.SaveObject, {
      id,
      target: this.targetData.entity.target,
      entity: this.entityForm.getRawValue()
    });
  }

  /**
   * Deletes the current object after user confirmation.
   * This method shows a confirmation dialog and, upon acceptance,
   * emits a delete event in the store with the current entity's ID and target.
   */
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

  /**
   * Initializes the object by fetching target and entity data.
   * This method retrieves the necessary data from the explorer service
   * and sets up the reactive form with the fetched entity data.
   */
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

  /**
   * Handles the received target data and updates the ViewModel state.
   * This method processes the fetched target and entity data,
   * updates the form controls, and emits the title for the header.
   * @param payload - The payload containing target and entity data.
   */
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

  /**
   * Handles the save event from the store and processes the result.
   * This method updates the UI based on the success or failure of the
   * save operation, and navigates to the newly created object if applicable.
   * @param data - The data from the save event.
   */
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
        const p2 = (entity as { [k: string]: unknown })[this.targetData.primaryColumn.property];
        const url = `/object/${p1}/${p2}`;
        const dupId = this.duplicateId;
        this.router.navigate([url], {replaceUrl: true}).then(() => {
          if (dupId) {
            location.reload();
          }
        });
      }
    });
  }

  /**
   * Handles the delete event from the store and processes the result.
   * This method updates the UI based on the success of the delete operation
   * and navigates back to the section view.
   * @param data - The data from the delete event.
   */
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
