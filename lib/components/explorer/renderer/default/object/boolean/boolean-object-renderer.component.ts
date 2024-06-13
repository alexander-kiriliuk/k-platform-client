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

import {ChangeDetectionStrategy, Component} from "@angular/core";
import {CheckboxModule} from "primeng/checkbox";
import {ReactiveFormsModule} from "@angular/forms";
import {LocalizePipe} from "../../../../../../modules/locale/localize.pipe";
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";
import {NumberUtils} from "../../../../../../global/util/number.utils";

@Component({
  selector: "boolean-object-renderer",
  standalone: true,
  templateUrl: "./boolean-object-renderer.component.html",
  styleUrls: ["./boolean-object-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckboxModule,
    LocalizePipe,
    ReactiveFormsModule,
  ]
})
export class BooleanObjectRendererComponent extends AbstractExplorerObjectRenderer {
  readonly id = NumberUtils.getRandomInt().toString();
}
