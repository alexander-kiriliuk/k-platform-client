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
import {DatePipe} from "@angular/common";
import {TabViewModule} from "primeng/tabview";
import {TranslocoPipe} from "@ngneat/transloco";
import {LocalizePipe} from "../../../../../../../modules/locale";
import {ExplorerObjectRendererComponent} from "../../../explorer-object-renderer.component";
import {AbstractExplorerObjectRenderer} from "../../../default/abstract-explorer-object-renderer";
import {FileMetadata} from "../../../../../../../modules/file";

/**
 * This component displays various metadata details about a file.
 */
@Component({
  selector: "file-metadata-object-renderer",
  standalone: true,
  templateUrl: "./file-metadata-object-renderer.component.html",
  styleUrls: ["./file-metadata-object-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocalizePipe,
    ExplorerObjectRendererComponent,
    TabViewModule,
    TranslocoPipe,
    DatePipe,
  ],
})
export class FileMetadataObjectRendererComponent extends AbstractExplorerObjectRenderer<unknown, FileMetadata> {
}
