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

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TranslocoService} from "@ngneat/transloco";
import {DropdownModule} from "primeng/dropdown";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LangUtils} from "../../global/utils/lang.utils";
import getCurrentLang = LangUtils.getCurrentLang;
import setLang = LangUtils.setLang;

@Component({
  selector: "lang-switcher",
  standalone: true,
  templateUrl: "./lang-switcher.component.html",
  styleUrls: ["./lang-switcher.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropdownModule,
    ReactiveFormsModule
  ]
})
export class LangSwitcherComponent {

  readonly ctrl: FormControl<string> = new FormControl(getCurrentLang());
  readonly langList = LangUtils.getAvailableLangCodes();
  private readonly ts = inject(TranslocoService);

  constructor() {
    this.ctrl.valueChanges.pipe(takeUntilDestroyed()).subscribe(v => {
      setLang(v);
      this.ts.setActiveLang(v);
      location.reload();
    });
  }

}
