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

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnInit,
  output
} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DialogService} from "primeng/dynamicdialog";
import {finalize} from "rxjs";
import {LocalizePipe} from "../../locale";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe} from "@ngneat/transloco";
import {NgTemplateOutlet} from "@angular/common";
import {RefNamePipe} from "./ref-name.pipe";
import {PageableParams, PlainObject} from "../../../global/vars";
import {SectionDialogConfig, TargetData, CachedExplorerService} from "../../../components/explorer";

/**
 * This component serves as an input for selecting
 * references to entities. It implements ControlValueAccessor to integrate with Angular forms.
 */
@Component({
  selector: "ref-input",
  standalone: true,
  templateUrl: "./ref-input.component.html",
  styleUrls: ["./ref-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    RippleModule,
    TranslocoPipe,
    RefNamePipe,
    NgTemplateOutlet,
  ],
  providers: [
    CachedExplorerService,
    DialogService,
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: RefInputComponent
    }
  ]
})
export class RefInputComponent implements ControlValueAccessor, OnInit {

  /** Target identifier for the reference input. */
  target = input.required<string>();
  /** Indicates if multiple selections are allowed. */
  multi = input<boolean>();
  /** Placeholder text for the input field. */
  placeholder = input<string>();
  /** Parameters for pagination or other settings. */
  params = input<PageableParams>();
  /** Event emitted when the input value changes. */
  changeData = output<unknown | unknown[]>();
  /** Data for the target reference. */
  targetData: TargetData;
  /** Indicates whether the input is disabled. */
  disabled = false;
  /** Indicates the loading state for the target data. */
  targetLoadingState = true;
  /** Data for the selected entity or entities. */
  private data: unknown | unknown[];
  private readonly cachedExplorerService = inject(CachedExplorerService);
  private readonly localizePipe = inject(LocalizePipe);
  private readonly dialogService = inject(DialogService);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Gets the single selected entity. */
  get entity() {
    return this.data as PlainObject;
  }

  /** Gets the array of selected entities. */
  get entities() {
    return this.data as PlainObject[];
  }

  /**
   * Initializes the component and loads the target data.
   */
  ngOnInit(): void {
    this.cachedExplorerService.getTarget(this.target(), "section").pipe(finalize(() => {
      this.targetLoadingState = false;
      this.cdr.markForCheck();
    })).subscribe(payload => {
      this.targetData = payload;
    });
  }

  /**
   * Writes the incoming value to the component.
   * @param res - The value to be written (can be a single entity or an array of entities).
   */
  writeValue(res: unknown | unknown[]) {
    if (!res) {
      return;
    }
    this.data = res;
    this.cdr.markForCheck();
  }

  /**
   * Opens a section dialog to allow the user to select entities.
   */
  openSection() {
    import("../../../components/explorer").then(m => {
      this.dialogService.open(m.ExplorerSectionComponent, {
        header: this.localizePipe.transform(this.targetData.entity.name, this.targetData.entity.target) as string,
        data: {
          target: this.targetData,
          multi: this.multi(),
          initialPageableParams: this.params()
        } as SectionDialogConfig,
        modal: true,
        position: "top",
      }).onClose.subscribe((res: unknown | unknown[]) => {
        if (!res) {
          return; // Exit if no result is returned
        }
        if (this.multi()) {
          if (!this.data) {
            this.data = []; // Initialize data array if it doesn't exist
          }
          (res as PlainObject[]).forEach(r => {
            const pkKey = this.targetData.primaryColumn.property; // Get the primary key property
            const pkVal = r[pkKey]; // Get the primary key value from the result
            if (!this.entities.find(v => v[pkKey] === pkVal)) {
              (this.data as unknown[]).push(r); // Add new entity to data if it doesn't already exist
            }
          });
        } else {
          this.data = res; // Set data to the single selected entity
        }
        this.synchronize(); // Emit the updated data
        this.cdr.markForCheck(); // Trigger change detection
      });
    });
  }

  /**
   * Removes an entity from the selected entities.
   * @param entity - The entity to be removed.
   */
  removeItem(entity: PlainObject) {
    if (!this.multi()) {
      this.data = null;
      this.synchronize();
      return;
    }
    const idx = this.entities.indexOf(entity);
    this.entities.splice(idx, 1);
  }

  /**
   * Synchronizes the internal data with the ControlValueAccessor interface.
   */
  synchronize() {
    this.onChange(this.data);
    this.changeData.emit(this.data);
  }

  registerOnChange(onChange: () => void) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void) {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.cdr.markForCheck();
  }

  onChange = (_: unknown | unknown[]) => {
  };

  onTouched = () => {
  };

}
