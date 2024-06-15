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
import {ExplorerService} from "../../explorer.service";
import {
  ExplorerColumn,
  SectionDialogConfig,
  SectionFilterDialogConfig,
  TargetData
} from "../../explorer.types";
import {SectionFilter} from "./section-filter-dialog.constants";
import {finalize} from "rxjs";
import {Params, QueryParamsHandling} from "@angular/router";
import {StringUtils} from "../../../../global/util/string.utils";
import {Store} from "../../../../modules/store/store";
import {LocalizePipe} from "../../../../modules/locale/localize.pipe";
import {SortOrder} from "../../../../global/types";
import {PreloaderEvent} from "../../../../modules/preloader/preloader.event";
import parseParamsString = StringUtils.parseParamsString;
import stringifyParamsObject = StringUtils.stringifyParamsObject;
import createFieldFilterForm = SectionFilter.createFieldFilterForm;

@Injectable()
export class SectionFilterDialogViewModel {

  private readonly _referencedTarget = signal<TargetData>(undefined);
  private readonly _referencedColumn = signal<ExplorerColumn>(undefined);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly dialogService = inject(DialogService);
  private readonly explorerService = inject(ExplorerService);
  private readonly store = inject(Store);
  private readonly localizePipe = inject(LocalizePipe);
  readonly form = createFieldFilterForm();

  constructor() {
    if (this.isReference) {
      this.getReferenceTarget();
      return;
    }
    this.initUi();
  }

  private get dialogConfig() {
    return this.config.data as SectionFilterDialogConfig;
  }

  private get referencedTarget() {
    return this._referencedTarget();
  }

  get queryParamsSnapshot() {
    return this.dialogConfig.paramsSnapshot();
  }

  get referencedColumn() {
    return this._referencedColumn();
  }

  get preloaderChannel() {
    return SectionFilter.PreloaderCn;
  }

  get column() {
    return this.dialogConfig.column;
  }

  get isReference() {
    return this.column.type === "reference";
  }

  get referenceField() {
    if (this.referencedColumn) {
      return {value: "", ref: `${this.referencedTarget.entity.target}.${this.referencedColumn.property}`};
    }
    const queryParams = {...this.queryParamsSnapshot};
    if (!queryParams.filter?.length) {
      return undefined;
    }
    const filter = parseParamsString(queryParams.filter);
    const value = filter[this.column.property];
    if (!value?.length) {
      return undefined;
    }
    const clearValue = value.replace(/\{[^}]*}/g, "");
    const match = value.match(/\{([^}]*)}/);
    return {value: clearValue, ref: match[1]};
  }

  setOrder(order: SortOrder) {
    const queryParams = {...this.queryParamsSnapshot};
    queryParams.sort = this.column.property;
    queryParams.order = order;
    queryParams.page = 1;
    this.doNavigate(queryParams);
    this.ref.close();
  }

  applyFilter() {
    const data = this.form.value;
    let value = data.value;
    if (this.column.type === "date" || this.referencedColumn?.type === "date") {
      const val = value as Date[];
      value = `FROM${val[0].getTime()}TO${val[1].getTime()}`;
    } else if (!data.exactMatch) {
      value = `%${data.value}%`;
    }
    const queryParams = {...this.queryParamsSnapshot};
    queryParams.page = 1;
    if (!queryParams.filter?.length) {
      queryParams.filter = `::${data.name}:${value}`;
      if (this.isReference) {
        queryParams.filter += `{${this.referenceField.ref}}`;
      }
    } else {
      const filter = parseParamsString(queryParams.filter);
      if (this.isReference) {
        filter[this.column.property] = `${value}{${this.referenceField.ref}}`;
      } else {
        filter[this.column.property] = value as string;
      }
      queryParams.filter = stringifyParamsObject(filter);
    }
    this.doNavigate(queryParams);
    this.ref.close();
  }

  showRefTargetDialog() {
    let selectedCol: string;
    if (this.referenceField?.ref) {
      const parts = this.referenceField.ref.split(".");
      selectedCol = parts[1];
    }
    import("./target/target-columns-dialog.component").then(m => {
      this.dialogService.open(m.TargetColumnsDialogComponent, {
        header: this.localizePipe.transform(
          this.referencedTarget.entity.name, this.referencedTarget.entity.target
        ) as string,
        data: {target: this.referencedTarget, selected: selectedCol},
        modal: true,
        position: "top",
      }).onClose.subscribe((col: ExplorerColumn) => {
        if (!col) {
          return;
        }
        this._referencedColumn.set(col);
        const type = this.referencedColumn.type;
        this.form.controls.value.reset();
        if (type === "boolean" || type === "date") {
          this.form.controls.exactMatch.setValue(true);
        }
      });
    });
  }

  openSectionDialog() {
    import("../section.component").then(m => {
      const entity = this.referencedTarget.entity;
      this.dialogService.open(m.SectionComponent, {
        header: this.localizePipe.transform(entity.name, entity.target) as string,
        data: {target: this.referencedTarget} as SectionDialogConfig,
        modal: true,
        position: "top",
      }).onClose.subscribe(payload => {
        if (!payload) {
          return;
        }
        this.form.controls.value.setValue(payload[this.referencedColumn.property]);
      });
    });
  }

  private initUi() {
    this.form.controls.name.setValue(this.column.property);
    const queryParams = {...this.queryParamsSnapshot};
    if (queryParams.filter?.length) {
      const filter = parseParamsString(queryParams.filter);
      let value = filter[this.column.property]?.replace(/\{[^}]*}/g, "");
      if (value?.length) {
        if (value.startsWith("%") && value.endsWith("%")) {
          this.form.controls.exactMatch.setValue(false);
          value = value.substring(1, value.length - 1);
        } else {
          this.form.controls.exactMatch.setValue(true);
        }
        if (this.column.type === "date" || this.referencedColumn?.type === "date") {
          const match = value.match(/FROM(\d+)TO(\d+)/);
          const fromTimestamp = match[1];
          const toTimestamp = match[2];
          const fromDate = new Date(parseInt(fromTimestamp, 10));
          const toDate = new Date(parseInt(toTimestamp, 10));
          this.form.controls.value.setValue([fromDate, toDate]);
        } else {
          this.form.controls.value.setValue(this.column.type === "boolean" ? value === "true" : value);
        }
      }
    }
    if (this.column.type === "boolean" || this.column.type === "date") {
      this.form.controls.exactMatch.setValue(true);
    }
  }

  private getReferenceTarget() {
    this.store.emit(PreloaderEvent.Show, this.preloaderChannel);
    this.explorerService.getTarget(this.column.referencedEntityName, "section").pipe(finalize(() => {
      this.store.emit(PreloaderEvent.Hide, this.preloaderChannel);
    })).subscribe(v => {
      this._referencedTarget.set(v);
      if (this.isReference && this.referenceField?.ref) {
        const parts = this.referenceField.ref.split(".");
        this._referencedColumn.set(this.referencedTarget.entity.columns.find(c => c.property === parts[1]));
      }
      this.initUi();
    });
  }

  private doNavigate(queryParams: Params, queryParamsHandling?: QueryParamsHandling) {
    return this.dialogConfig.navigate(queryParams, queryParamsHandling);
  }

}
