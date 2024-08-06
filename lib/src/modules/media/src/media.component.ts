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

import {ChangeDetectionStrategy, Component, HostBinding, inject, input} from "@angular/core";
import {Media, MediaFile} from "./media.types";
import {ImageModule} from "primeng/image";
import {MediaUrlPipe} from "./media-url.pipe";
import {DomSanitizer} from "@angular/platform-browser";
import {ReservedMediaFormat} from "./media.constants";
import {LocalizePipe} from "../../locale";

/**
 * MediaComponent that displays media content with various formatting options.
 * It utilizes the MediaUrlPipe for URL transformation and LocalizePipe for localization.
 * This component supports dynamic background images and zoom functionality for previews.
 */
@Component({
  selector: "media-res",
  standalone: true,
  templateUrl: "./media.component.html",
  styleUrls: ["./media.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImageModule,
    LocalizePipe
  ],
  providers: [MediaUrlPipe]
})
export class MediaComponent {

  /** The source media object that is required for the component to function. */
  src = input.required<Media>();

  /**
   * The format of the media being displayed.
   * Defaults to ReservedMediaFormat.ORIGINAL if not specified.
   */
  format = input<string>(ReservedMediaFormat.ORIGINAL);

  /** Boolean indicating whether a background image should be displayed. */

  background = input<boolean>();

  /** Boolean indicating whether the media should be zoomed in for preview.*/
  zoom = input<boolean>();

  private readonly localizePipe = inject(LocalizePipe);
  private readonly mediaUrlPipe = inject(MediaUrlPipe);
  private readonly sanitizer = inject(DomSanitizer);

  /**
   * Host binding to apply background class based on the background input.
   * @returns {boolean}
   */
  @HostBinding("class.background")
  private get cssClass(): boolean {
    return this.background();
  }

  /**
   * Host binding to apply has-preview class based on the zoom input.
   * @returns {boolean}
   */
  @HostBinding("class.has-preview")
  private get previewClass(): boolean {
    return this.zoom();
  }

  /**
   * Host binding to set the style attribute for the background image if applicable.
   */
  @HostBinding("style")
  private get styleAttr() {
    if (!this.background()) {
      return undefined;
    }
    return this.sanitizer.bypassSecurityTrustStyle(`background-image: url(${this.url});`);
  }

  /**
   * Retrieves the URL for the media based on the specified format.
   * @param format - The format of the media to retrieve the URL for.
   * @returns {string}
   */
  private getUrl(format: string): string {
    return this.mediaUrlPipe.transform(this.src(), format);
  }

  /**
   * Determines the media format based on the file extension.
   * If the media type is SVG, it defaults to the original format.
   * @returns {string}
   */
  get mediaFormat(): ReservedMediaFormat | string {
    const ext = this.src()?.type?.ext?.code;
    if (ext === "svg") {
      return ReservedMediaFormat.ORIGINAL;
    }
    return this.format();
  }

  /**
   * Gets the URL for the media based on its format.
   * @returns {string}
   */
  get url(): string {
    return this.getUrl(this.mediaFormat);
  }

  /**
   * Retrieves the specific file from the media that matches the current format.
   * @returns {MediaFile}
   */
  get file(): MediaFile {
    return this.src()?.files?.find(v => v.format.code === this.mediaFormat);
  }

  /**
   * Retrieves the width of the media file.
   * @returns {string}
   */
  get width(): string {
    return this.file?.width ? this.file.width.toString() : undefined;
  }

  /**
   * Retrieves the height of the media file.
   * @returns {string}
   */
  get height(): string {
    return this.file?.height ? this.file.height.toString() : undefined;
  }

  /**
   * Gets the original URL for the media.
   * @returns {string}
   */
  get originalUrl(): string {
    return this.getUrl(ReservedMediaFormat.ORIGINAL);
  }

  /**
   * Provides the localized name of the media for accessibility.
   * @returns {string}
   */
  get alt(): string {
    return this.localizePipe.transform(this.src()?.name) as string;
  }

}
