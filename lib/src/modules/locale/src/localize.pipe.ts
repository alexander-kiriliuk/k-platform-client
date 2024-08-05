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

import {inject, Pipe, PipeTransform} from "@angular/core";
import {LocalizedMedia, LocalizedString} from "./locale.types";
import {TranslocoService} from "@ngneat/transloco";
import {Media} from "../../media";

/** Pipe for localizing values based on the active language. */
@Pipe({
  name: "localize",
  standalone: true
})
export class LocalizePipe implements PipeTransform {

  private readonly ts = inject(TranslocoService);

  /** Transforms the input value to the corresponding localized value. */
  transform(incomeValue: Array<LocalizedString | LocalizedMedia>, fallbackValue?: string): string | Media {
    const lang = this.ts.getActiveLang();
    const res = incomeValue?.find(v => v.lang.id === lang);
    if (!res) {
      return fallbackValue;
    }
    return res.value;
  }

}
