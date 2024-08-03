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

import {FormControl} from "@angular/forms";
import {TargetData} from "../../explorer";

/**
 * Interface representing parameters for the XDB export dialog.
 */
export interface XdbExportDialogParams {

  /** Target data for the export. **/
  target: TargetData;
  /** Entity to be exported. **/
  entity: { [k: string]: unknown };
}

/**
 * Interface representing parameters for the XDB export.
 */
export interface XdbExportParams {
  /** Target ID for the export. **/
  target: string;
  /** Entity ID for the export. **/
  id: string;
  /** Depth of the data export. **/
  depth: number;
  /** Flag indicating whether files should be included in the export and add that to archive. **/
  useFiles: boolean;
  /** List of properties to be excluded from the export. **/
  excludeProperties: string[];
}

/**
 * Type representing the form controls for the XDB export.
 */
export type XdbExportForm = {
  [K in keyof XdbExportParams]: FormControl<XdbExportParams[K]>;
}

/**
 * Type representing the DTO for the XDB export response.
 */
export type XdbExportDto = {
  file: string;
}
