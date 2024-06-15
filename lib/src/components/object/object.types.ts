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

import {FormArray, FormControl, FormGroup} from "@angular/forms";
import { ExplorerColumn, ExplorerTab, ExplorerTarget } from "../explorer/explorer.types";

type ObjectForm = {
  [K in keyof ExplorerTarget]: FormControl<ExplorerTarget[K]>;
}

export type ColumnForm = {
  [K in keyof ExplorerColumn]: FormControl<ExplorerColumn[K]>;
}

export interface TargetForm extends Omit<ObjectForm, "columns"/* | "actions"*/> {
  columns: FormArray<FormGroup<ColumnForm>>;
}

export type TabForm = {
  [K in keyof ExplorerTab]: FormControl<ExplorerTab[K]>;
}
