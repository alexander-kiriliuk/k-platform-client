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

/**
 * Parameters for configuring the StringObjectRenderer component.
 * @property {boolean} readonly - Indicates if the input field is read-only.
 * @property {boolean} disabled - Indicates if the input field is disabled.
 * @property {boolean} textarea - Indicates if the input should be rendered as a textarea.
 * @property {boolean} textareaAutoResize - Indicates if the textarea should automatically resize.
 */
export interface StringObjectRendererParams {
  readonly: boolean;
  disabled: boolean;
  textarea: boolean;
  textareaAutoResize: boolean;
}
