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
import { LocalizeStringInputComponent, LocalizePipe } from "../../../../../../../modules/locale";
import {RefInputComponent} from "../../../../../../../modules/ref-input";
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";

/**
 * This component allows for input of strings in various languages or localizations.
 */
@Component({
  selector: "localized-string-object-renderer",
  standalone: true,
  templateUrl: "./localized-string-object-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocalizeStringInputComponent,
    TranslocoPipe,
    LocalizePipe,
    RefInputComponent,
    ReactiveFormsModule
  ]
})
export class LocalizedStringObjectRendererComponent extends AbstractExplorerObjectRenderer {
}
