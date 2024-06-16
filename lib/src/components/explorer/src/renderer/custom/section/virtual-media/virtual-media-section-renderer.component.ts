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
import {AbstractExplorerSectionRenderer} from "../../../default/abstract-explorer-section-renderer";
import {MediaComponent, Media} from "../../../../../../../modules/media";

@Component({
  selector: "virtual-media-section-renderer",
  standalone: true,
  templateUrl: "./virtual-media-section-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MediaComponent,
  ],
})
export class VirtualMediaSectionRendererComponent extends AbstractExplorerSectionRenderer<Media> {

  get media() {
    return this.data as unknown as Media;
  }

}
