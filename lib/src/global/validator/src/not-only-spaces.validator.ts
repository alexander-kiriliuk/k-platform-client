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

import {AbstractControl, ValidatorFn} from "@angular/forms";

/**
 * Validator to check if a string contains more than just spaces.
 * @returns A validator function for the form control.
 */
export function notOnlySpacesValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const forbidden = !/^(\s+\S+\s*)*(?!\s).*$/.test(control.value);
    return forbidden ? {onlySpacesError: {value: control.value}} : null;
  };
}
