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

import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {TranslocoPipe} from "@ngneat/transloco";
import {ReactiveFormsModule} from "@angular/forms";
import {LocalizedMediaObjectRendererTypes} from "./localized-media-object-renderer.types";
import {RefInputComponent} from "../../../../../../modules/ref-input/ref-input.component";
import {LocalizePipe} from "../../../../../../modules/locale/localize.pipe";
import {LocalizeMediaInputComponent} from "../../../../../../modules/locale/media-input/localize-media-input.component";
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";
import {LocalizedMedia} from "../../../../../../modules/locale/locale.types";

@Component({
  selector: "localized-media-object-renderer",
  standalone: true,
  templateUrl: "./localized-media-object-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RefInputComponent,
    TranslocoPipe,
    LocalizePipe,
    ReactiveFormsModule,
    LocalizeMediaInputComponent
  ]
})
export class LocalizedMediaObjectRendererComponent
  extends AbstractExplorerObjectRenderer <LocalizedMedia, unknown, LocalizedMediaObjectRendererTypes>
  implements OnInit {

  mediaType = "default";

  ngOnInit(): void {
    if (this.params?.type) {
      this.mediaType = this.params.type;
    }
  }

}
