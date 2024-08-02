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
import {fieldMatchValidator} from "../../../../../../../global/validator";

/**
 * Creates a new form group for password input.
 * @returns The newly created form group for password inputs.
 */
export function createNewPasswordObjectRendererForm() {
  return new FormGroup({
    newPassword: new FormControl<string>("", [Validators.required]),
    repeatPassword: new FormControl<string>("", [Validators.required])
  }, fieldMatchValidator("newPassword", "repeatPassword"));
}


