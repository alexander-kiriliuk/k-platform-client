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
import {TranslocoPipe} from "@ngneat/transloco";
import {ReactiveFormsModule} from "@angular/forms";
import {RefInputComponent} from "../../../../../../../modules/ref-input";
import {LocalizePipe} from "../../../../../../../modules/locale";
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";

@Component({
  selector: "reference-object-renderer",
  standalone: true,
  templateUrl: "./reference-object-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RefInputComponent,
    TranslocoPipe,
    LocalizePipe,
    ReactiveFormsModule
  ]
})
export class ReferenceObjectRendererComponent extends AbstractExplorerObjectRenderer {
}
