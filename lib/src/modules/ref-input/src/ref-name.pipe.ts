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

import {inject, Pipe, PipeTransform} from "@angular/core";
import {LocalizedString, LocalizePipe} from "../../locale";
import {PlainObject} from "../../../global/vars";
import {TargetData} from "../../../components/explorer";

/**
 * This pipe transforms a given entity into a human-readable name
 * based on its target data and localization settings.
 */
@Pipe({
  name: "refName",
  standalone: true
})
export class RefNamePipe implements PipeTransform {

  private readonly localizePipe = inject(LocalizePipe);

  /**
   * Transforms the given entity into a localized name based on the target data.
   * @param entity - The entity object from which to extract the name.
   * @param target - The target data containing information about the entity.
   * @returns The localized name of the entity or an empty string if the target is not defined.
   */
  transform(entity: PlainObject, target: TargetData) {
    if (!target) {
      return ""; // Return empty string if target is not provided
    }
    const val = entity[target.namedColumn.property]; // Get the value from the entity based on the target
    if (val) {
      if (target.namedColumn.referencedEntityName === "LocalizedStringEntity") {
        // Use localization if the entity references a localized string
        return this.localizePipe.transform(
          val as LocalizedString[], entity[target.primaryColumn.property] as string
        );
      }
    }
    return entity[target.primaryColumn.property]; // Return the primary column value if no localization is needed
  }

}
