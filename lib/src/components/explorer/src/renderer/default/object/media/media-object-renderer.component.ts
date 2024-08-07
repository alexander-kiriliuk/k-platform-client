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

import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe} from "@ngneat/transloco";
import {MediaObjectRendererParams} from "./media-object-renderer.types";
import {MediaInputComponent} from "../../../../../../../modules/media";
import {LocalizePipe} from "../../../../../../../modules/locale";
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";
import {Media} from "../../../../../../../modules/media";

/**
 * This component allows for media input and provides configuration
 * options for different media types.
 */
@Component({
  selector: "media-object-renderer",
  standalone: true,
  templateUrl: "./media-object-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MediaInputComponent,
    PaginatorModule,
    ReactiveFormsModule,
    TranslocoPipe,
    LocalizePipe,
  ],
})
export class MediaObjectRendererComponent
  extends AbstractExplorerObjectRenderer<Media | Media[], unknown, MediaObjectRendererParams> implements OnInit {

  /** The current media type being rendered. */
  mediaType = "default";

  /**
   * Initializes the component and sets the media type based on parameters.
   */
  ngOnInit(): void {
    if (this.params?.type) {
      this.mediaType = this.params.type;
    }
  }

}
