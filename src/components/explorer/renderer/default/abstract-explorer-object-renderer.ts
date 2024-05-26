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

import {FormControl, FormGroup} from "@angular/forms";
import {ExplorerColumn, ExplorerRenderer, TargetData} from "../../explorer.types";
import {PlainObject} from "../../../../global/types";

export abstract class AbstractExplorerObjectRenderer<Data = unknown, Property = unknown, Params = unknown>
implements ExplorerRenderer<Data, Params> {
  column: ExplorerColumn;
  params: Params;
  data: Data;
  target: TargetData;
  entityForm: FormGroup;

  get ctrl() {
    return this.entityForm.controls[this.column.property] as FormControl;
  }

  get propertyData() {
    if (!this.data) {
      return undefined;
    }
    return (this.data as PlainObject)[this.column.property] as Property;
  }

}
