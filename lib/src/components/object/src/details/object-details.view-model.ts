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

import {ChangeDetectorRef, inject, Injectable} from "@angular/core";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService} from "primeng/api";
import {TranslocoService} from "@ngneat/transloco";
import {finalize, tap, throwError} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError} from "rxjs/operators";
import {ObjectDetails} from "./object-details.constants";
import {LocalizePipe} from "../../../../modules/locale";
import {Store} from "../../../../modules/store";
import {ColumnForm, TabForm} from "../object.types";
import {onlyLatinLettersAndNumbersValidator} from "../../../../global/validator";
import {PreloaderEvent} from "../../../../modules/preloader";
import {
  ExplorerColumn,
  ExplorerService,
  ExplorerTab,
  ExplorerTarget,
  SectionDialogConfig
} from "../../../explorer";
import {ToastData, ToastEvent} from "../../../../global/vars";
import createTargetForm = ObjectDetails.createTargetForm;
import createColumnForm = ObjectDetails.createColumnForm;
import createTabForm = ObjectDetails.createTabForm;


@Injectable()
export class ObjectDetailsViewModel {

  readonly newColumnDialogKey = "newColumnDialog";
  readonly newTabDialogKey = "newTabDialog";
  private readonly explorerService = inject(ExplorerService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly dialogService = inject(DialogService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly store = inject(Store);
  private readonly ts = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly targetForm = createTargetForm();
  tabForm: FormGroup<TabForm>;
  newColName: FormControl<string> = new FormControl(null, [
    Validators.required,
    onlyLatinLettersAndNumbersValidator()
  ]);

  get preloaderChannel() {
    return ObjectDetails.PreloaderCn;
  }

  get target() {
    return this.config.data as string;
  }

  removeColumn(columnIndex: number) {
    this.targetForm.controls.columns.removeAt(columnIndex);
  }

  clearColumnTab(colForm: FormGroup<ColumnForm>) {
    colForm.controls.tab.reset();
  }

  openTabFinder(colForm: FormGroup<ColumnForm>) {
    this.explorerService.getTarget("ExplorerTabEntity").pipe(
      tap(() => this.store.emit(PreloaderEvent.Show, this.preloaderChannel)),
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel)),
    ).subscribe(targetData => {
      import("../../../explorer").then(m => {
        this.dialogService.open(m.SectionComponent, {
          header: this.localizePipe.transform(targetData.entity.name, targetData.entity.target) as string,
          data: {
            target: targetData,
            multi: false,
            initialPageableParams: {filter: `::target:%${this.target}%{ExplorerTargetEntity.target}`}
          } as SectionDialogConfig,
          modal: true,
          position: "top",
        }).onClose.subscribe((res: ExplorerTab) => {
          if (!res) {
            return;
          }
          colForm.controls.tab.setValue(res);
          this.cdr.markForCheck();
        });
      });
    });
  }

  createTab() {
    this.tabForm = createTabForm({target: this.targetForm.value.target} as ExplorerTarget);
    this.confirmationService.confirm({
      key: this.newTabDialogKey,
      accept: () => {
        this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
        const payload = this.tabForm.getRawValue();
        this.explorerService.saveEntity(payload, "ExplorerTabEntity")
          .pipe(
            catchError((res) => {
              this.store.emit<ToastData>(ToastEvent.Error, {
                title: this.ts.translate("object.details.tab.error")
              });
              return throwError(res);
            }),
            finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel))
          )
          .subscribe(() => {
            this.tabForm.reset();
            this.store.emit<ToastData>(ToastEvent.Success, {
              title: this.ts.translate("object.details.tab.success")
            });
          });
      }
    });
  }

  saveObject() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.explorerService.saveTarget(this.targetForm.getRawValue()).pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {
          title: this.ts.translate("object.details.error"),
          message: res.error.message
        });
        return throwError(res);
      }),
      finalize(() => this.store.emit(PreloaderEvent.Hide, this.preloaderChannel))
    ).subscribe(v => {
      this.targetForm.patchValue(v);
      v.columns.forEach(col => this.targetForm.controls.columns.push(createColumnForm(col)));
      this.store.emit<ToastData>(ToastEvent.Success, {
        title: this.ts.translate("object.details.success")
      });
      this.ref.close();
    });
  }

  addVirtualColumn() {
    this.newColName.reset();
    this.confirmationService.confirm({
      key: this.newColumnDialogKey,
      accept: () => {
        const propName = this.newColName.value;
        const exists = this.targetForm.controls.columns.getRawValue()
          .find(v => v.property === propName);
        if (exists) {
          this.store.emit<ToastData>(ToastEvent.Warn, {
            title: this.ts.translate("object.details.col.new.warn")
          });
          return;
        }
        const newCol = createColumnForm({
          id: `${this.targetForm.value.tableName}.${propName}`,
          property: propName,
          virtual: true
        } as ExplorerColumn);
        newCol.controls.type.setValue("unknown");
        newCol.controls.sectionPriority.setValue(0);
        newCol.controls.sectionEnabled.setValue(false);
        newCol.controls.objectPriority.setValue(0);
        newCol.controls.objectEnabled.setValue(false);
        this.targetForm.controls.columns.push(newCol);
        this.store.emit<ToastData>(ToastEvent.Success, {
          title: this.ts.translate("object.details.col.new.success")
        });
      }
    });
  }

  openColumnEditor(colForm: FormGroup<ColumnForm>) {
    import("./column-editor/object-details-column-editor.component").then(c => {
      this.dialogService.open(c.ObjectDetailsColumnEditorComponent, {
        header: this.localizePipe.transform(colForm.controls.name.value, colForm.controls.id.value)?.toString(),
        data: colForm,
        resizable: true,
        draggable: true,
        modal: true,
        position: "center"
      }).onClose.subscribe(() => {
        this.cdr.markForCheck();
      });
    });
  }

}
