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
import {MediaUrlPipe} from "../../../../../../modules/media/media-url.pipe";
import {LocalizePipe} from "../../../../../../modules/locale/localize.pipe";
import {FileSizePipe} from "../../../../../../modules/file/file-size.pipe";
import {AbstractExplorerObjectRenderer} from "../../../default/abstract-explorer-object-renderer";
import {ReservedMediaFormat} from "../../../../../../modules/media/media.constants";
import {Media} from "../../../../../../modules/media/media.types";
import {MEDIA_URL} from "../../../../../../global/constants";

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

  private readonly mediaUrl = inject(MEDIA_URL);
  private readonly mediaUrlPipe = inject(MediaUrlPipe);

  get thumbUrl() {
    return this.mediaUrlPipe.transform(this.media, ReservedMediaFormat.THUMB);
  }

  get url() {
    return `${this.mediaUrl}/${this.media.id}`;
  }

  get media() {
    return this.data as unknown as Media;
  }

  get files() {
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
