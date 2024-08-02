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
import {AbstractExplorerSectionRenderer} from "../../abstract-explorer-section-renderer";
import {Media, MediaComponent} from "../../../../../../../modules/media";

/**
 * This component extends AbstractExplorerSectionRenderer specifically
 * for media types and provides methods to manage and display media data.
 */
@Component({
  selector: "media-section-renderer",
  standalone: true,
  templateUrl: "./media-section-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MediaComponent,
  ],
})
export class MediaSectionRendererComponent extends AbstractExplorerSectionRenderer<Media | Media[]> {

  /**
   * Retrieves the dataset to be rendered based on whether the column allows multiple entries.
   * @returns {Media[]} An array of media data to be displayed.
   */
  get dataSet(): Media[] {
    if (!this.column.multiple) {
      return [this.data[this.column.property]] as Media[];
    }
    return this.data[this.column.property] as Media[];
  }

}
