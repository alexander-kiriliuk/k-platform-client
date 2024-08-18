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
import {ExplorerColumn, ExplorerRenderer, TargetData} from "../../../../explorer";
import {PlainObject} from "../../../../../global/vars";

/**
 * Abstract base class for rendering objects in the explorer.
 * This class provides common properties and methods for object
 * renderers, including handling entity forms and accessing property data
 * based on the specified column definition.
 */
export abstract class AbstractExplorerObjectRenderer<Data = unknown, Property = unknown, Params = unknown>
implements ExplorerRenderer<Data, Params> {

  /** The column definition used for rendering the object. */
  column: ExplorerColumn;
  /** Parameters for customizing the renderer's behavior. */
  params: Params;
  /** The data for the object to be rendered. */
  data: Data;
  /** The entity data associated with this object. */
  target: TargetData;
  /** The form group associated with the entity data. */
  entityForm: FormGroup<{
    [K in keyof Data]: FormControl<Data[K]>;
  }>;


  /**
   * Gets the control corresponding to the column property in the entity form.
   * @returns The form control for the column property.
   */
  get ctrl() {
    // @ts-ignore
    return this.entityForm.controls[this.column.property] as FormControl;
  }

  /**
   * Retrieves the data corresponding to the specified column property.
   * @returns The value of the column property, or undefined if no data exists.
   */
  get propertyData() {
    if (!this.data) {
      return undefined;
    }
    return (this.data as PlainObject)[this.column.property] as Property;
  }

}
