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
import {TranslocoPipe} from "@ngneat/transloco";
import {LocalizePipe} from "../../../../../../../modules/locale";
import {FileSizePipe} from "../../../../../../../modules/file";
import {AbstractExplorerObjectRenderer} from "../../../default/abstract-explorer-object-renderer";
import {File} from "../../../../../../../modules/file";
import {API_URL, FILE_URL} from "../../../../../../../global/vars";

/**
 * This component displays file details and provides the URL for access.
 */
@Component({
  selector: "file-stat-media-object-renderer",
  standalone: true,
  templateUrl: "./file-stat-media-object-renderer.component.html",
  styleUrls: ["./file-stat-media-object-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocalizePipe,
    FileSizePipe,
    TranslocoPipe,
  ],
})
export class FileStatMediaObjectRendererComponent extends AbstractExplorerObjectRenderer<File> {

  /** The base URL for API requests. */
  private readonly apiUrl = inject(API_URL);
  /** The base URL for file access. */
  private readonly fileUrl = inject(FILE_URL);

  /**
   * Gets the URL for the file object.
   * @returns  The constructed file URL.
   */
  get url() {
    if (this.data.public) {
      return `${this.fileUrl}/${this.data.id}/${this.data.path}`;
    }
    return `${this.apiUrl}/file/private/${this.data.id}`;
  }

}
