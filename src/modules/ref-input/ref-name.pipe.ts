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
import {LocalizedString} from "../locale/locale.types";
import {LocalizePipe} from "../locale/localize.pipe";
import {PlainObject} from "../../global/types";
import {TargetData} from "../../components/explorer/explorer.types";

@Pipe({
  name: "refName",
  standalone: true
})
export class RefNamePipe implements PipeTransform {

  private readonly localizePipe = inject(LocalizePipe);

  transform(entity: PlainObject, target: TargetData) {
    if (!target) {
      return "";
    }
    const val = entity[target.namedColumn.property];
    if (val) {
      if (target.namedColumn.referencedEntityName === "LocalizedStringEntity") {
        return this.localizePipe.transform(
          val as LocalizedString[], entity[target.primaryColumn.property] as string
        );
      }
    }
    return entity[target.primaryColumn.property];
  }

}
