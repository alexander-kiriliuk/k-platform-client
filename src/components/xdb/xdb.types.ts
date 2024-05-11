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

import {TargetData} from "../explorer/explorer.types";
import {FormControl} from "@angular/forms";

export interface XdbExportDialogParams {
  target: TargetData;
  entity: { [k: string]: unknown };
}

export interface XdbExportParams {
  target: string;
  id: string;
  depth: number;
  useFiles: boolean;
  excludeProperties: string[];
}

export type XdbExportForm = {
  [K in keyof XdbExportParams]: FormControl<XdbExportParams[K]>;
}

export type XdbExportDto = {
  file: string;
}
