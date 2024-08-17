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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input} from "@angular/core";
import {Language, LocalizedMedia, LocalizedString} from "../locale.types";
import {AVAIL_LANGS} from "../locale.constants";
import {TranslocoPipe, TranslocoService} from "@ngneat/transloco";
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule
} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {SharedModule} from "primeng/api";
import {TabViewModule} from "primeng/tabview";
import {MediaComponent, MediaInputComponent, MediaTypeVariant} from "../../../media";
import {NumberUtils} from "../../../../global/util";


/**
 * Component for localizing media input. Allow to use images for different locales.
 */
@Component({
  selector: "localize-media-input",
  standalone: true,
  templateUrl: "./localize-media-input.component.html",
  styleUrls: ["./localize-media-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputTextareaModule,
    MediaComponent,
    ReactiveFormsModule,
    SharedModule,
    TabViewModule,
    FormsModule,
    MediaInputComponent,
    TranslocoPipe
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LocalizeMediaInputComponent
    },
  ]
})
export class LocalizeMediaInputComponent implements ControlValueAccessor {
  /** Placeholder text for the input. */
  placeholder = input<string>();
  /** Indicates the required media type. */
  mediaType = input.required<MediaTypeVariant>();
  /** Holds the localized media data. */
  resData: { [k: string]: LocalizedMedia };
  /** Indicates whether the input is disabled. */
  disabled = false;
  /** Active tab index. */
  activeTab = 0;
  /** Unique identifier for the input tag. */
  readonly id = `lsi-${NumberUtils.getRandomInt()}`;
  /** List of available languages. */
  readonly langList: Language[] = [];
  private readonly availableLangs = inject(AVAIL_LANGS);
  private readonly ts = inject(TranslocoService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.langList = this.availableLangs.filter(v => v.id === this.ts.getActiveLang());
    for (const v of this.availableLangs) {
      if (v.id !== this.ts.getActiveLang()) {
        this.langList.push(v);
      }
    }
  }

  /** Writes the localized media data to the control. */
  writeValue(res: LocalizedMedia[]) {
    if (!res) {
      this.initEmptyValues();
      return;
    }
    this.resData = {};
    for (const v of res) {
      this.resData[v.lang.id] = v;
    }
    if (Object.keys(this.resData).length) {
      for (const lang of this.langList) {
        if (this.resData[lang.id]) {
          continue;
        }
        this.resData[lang.id] = {
          lang: lang,
          value: null
        } as LocalizedMedia;
      }
    }
    this.synchronize();
    this.cdr.markForCheck();
  }

  /** Synchronizes the localized media data with the form control. */
  synchronize() {
    const res: LocalizedMedia[] = [];
    for (const k in this.resData) {
      res.push(this.resData[k]);
    }
    this.onChange(res);
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

  onChange = (_: LocalizedMedia[]) => {
  };

  onTouched = () => {
  };

  /** Initializes empty values for the localized media data. */
  private initEmptyValues() {
    this.resData = {};
    for (const lang of this.availableLangs) {
      this.resData[lang.id] = {value: null, lang} as LocalizedMedia;
    }
    this.synchronize();
  }

}
