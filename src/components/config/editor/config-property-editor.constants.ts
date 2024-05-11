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
import {ConfigEditorForm} from "../config.types";
import {notOnlySpacesValidator} from "../../../global/validator/not-only-spaces.validator";

export namespace ConfigPropertyEditor {

  export function createForm(): FormGroup<ConfigEditorForm> {
    return new FormGroup<ConfigEditorForm>({
      key: new FormControl<string>("", [Validators.required, notOnlySpacesValidator()]),
      value: new FormControl<string>("", [Validators.required, notOnlySpacesValidator()])
    });
  }

}
