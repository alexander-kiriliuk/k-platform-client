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
 * Validator to check if a string contains only Latin letters and numbers.
 * @returns A validator function for the form control.
 */
export function onlyLatinLettersAndNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const forbidden = !/^[A-Za-z0-9]+$/.test(control.value);
    return forbidden ? {hyphensError: {value: control.value}} : null;
  };
}

/**
 * Validator to check if a string contains only Latin letters, numbers, and hyphens.
 * @returns A validator function for the form control.
 */
export function onlyLatinLettersAndNumbersWithHyphensValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } | null => {
    const forbidden = !/^[A-Za-z0-9-]+$/.test(control.value);
    return forbidden ? {hyphensError: {value: control.value}} : null;
  };
}
