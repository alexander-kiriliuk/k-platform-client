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
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Language, LocalizedString} from "../locale.types";
import {AVAIL_LANGS} from "../locale.constants";
import {TabViewModule} from "primeng/tabview";
import {TranslocoService} from "@ngneat/transloco";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NumberUtils} from "../../../global/util/number.utils";
import {MediaComponent} from "../../media/media.component";

@Component({
  selector: "localize-string-input",
  standalone: true,
  templateUrl: "./localize-string-input.component.html",
  styleUrls: ["./localize-string-input.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TabViewModule,
    MediaComponent,
    InputTextareaModule,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LocalizeStringInputComponent
    },
  ]
})
export class LocalizeStringInputComponent implements ControlValueAccessor {

  placeholder = input<string>();
  resData: { [k: string]: LocalizedString };
  disabled = false;
  activeTab = 0;
  readonly id = `lsi-${NumberUtils.getRandomInt()}`;
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

  writeValue(res: LocalizedString[]) {
    if (!res) {
      this.initEmptyValues();
      return;
    }
    this.resData = {};
    for (const v of res) {
      this.resData[v.lang.id] = v;
    }
    this.synchronize();
    this.cdr.markForCheck();
  }

  synchronize() {
    const res: LocalizedString[] = [];
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

  onChange = (res: LocalizedString[]) => {
  };

  onTouched = () => {
  };

  private initEmptyValues() {
    this.resData = {};
    for (const lang of this.availableLangs) {
      this.resData[lang.id] = {value: null, lang} as LocalizedString;
    }
    this.synchronize();
  }

}
