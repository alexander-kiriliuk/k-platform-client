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


import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FieldFilterForm} from "./section-filter-dialog.types";


export namespace SectionFilter {

  export const PreloaderCn = "section-filter-cn";

  /**
   * Creates a new instance of the field filter form.
   * @returns {FormGroup<FieldFilterForm>} The created field filter form.
   */
  export function createFieldFilterForm(): FormGroup<FieldFilterForm> {
    return new FormGroup<FieldFilterForm>({
      name: new FormControl<string>("", [Validators.required]),
      value: new FormControl<string | number | boolean | Date[]>("", [Validators.required]),
      exactMatch: new FormControl<boolean>(false)
    });
  }

}
