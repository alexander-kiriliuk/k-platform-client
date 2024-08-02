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

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {NgTemplateOutlet} from "@angular/common";
import {ImageModule} from "primeng/image";
import {ImagesStatFileItem} from "./images-stats-media-object-renderer.types";
import {MediaUrlPipe} from "../../../../../../../modules/media";
import {LocalizePipe} from "../../../../../../../modules/locale";
import {FileSizePipe} from "../../../../../../../modules/file";
import {AbstractExplorerObjectRenderer} from "../../../default/abstract-explorer-object-renderer";
import {ReservedMediaFormat} from "../../../../../../../modules/media";
import {Media} from "../../../../../../../modules/media";
import {MEDIA_URL} from "../../../../../../../global/vars";


/**
 * This component displays media file statistics and handles duplicates.
 */
@Component({
  selector: "images-stats-media-object-renderer",
  standalone: true,
  templateUrl: "./images-stats-media-object-renderer.component.html",
  styleUrls: ["./images-stats-media-object-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MediaUrlPipe],
  imports: [
    LocalizePipe,
    FileSizePipe,
    ImageModule,
    NgTemplateOutlet
  ],
})
export class ImagesStatsMediaObjectRendererComponent extends AbstractExplorerObjectRenderer {

  /** The base URL for media resources. */
  private readonly mediaUrl = inject(MEDIA_URL);
  /** Pipe for transforming media URLs. */
  private readonly mediaUrlPipe = inject(MediaUrlPipe);

  /**
   * Gets the thumbnail URL for the media object.
   * @returns The transformed thumbnail URL.
   */
  get thumbUrl() {
    return this.mediaUrlPipe.transform(this.media, ReservedMediaFormat.THUMB);
  }

  /**
   * Gets the URL for the media object.
   * @returns The constructed media URL.
   */
  get url() {
    return `${this.mediaUrl}/${this.media.id}`;
  }


  /**
   * Retrieves the media object being rendered.
   * @returns The media object.
   */
  get media() {
    return this.data as unknown as Media;
  }

  /**
   * Gets a list of files associated with the media, including duplicates.
   * @returns {ImagesStatFileItem[]} The list of media files with duplicates.
   */
  get files(): ImagesStatFileItem[] {
    const res: ImagesStatFileItem[] = [];
    if (!this.media?.files) {
      return res;
    }
    for (const file of this.media.files) {
      const founded = res.find(f => f.name === file.name);
      if (founded) {
        founded.duplicate = file;
        continue;
      }
      res.push(file as ImagesStatFileItem);
    }
    return res;
  }

}
