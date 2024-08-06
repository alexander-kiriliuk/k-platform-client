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


import {UploadEvent} from "primeng/fileupload";
import {LocalizedString} from "../../locale";

/**
 * Represents a media object.
 */
export interface Media {
  id: number;
  code: string;
  name: LocalizedString[];
  type: MediaType;
  files: MediaFile[];
}

/**
 * Represents the type of media.
 */
export interface MediaType {
  code: string;
  name: string;
  vp6: boolean;
  private: boolean;
  quality: number;
  ext: MediaExt;
  formats: MediaFormat[];
}

/**
 * Represents the format of a media file.
 */
export interface MediaFormat {
  code: string;
  name: string;
  width: string;
  height: string;
}

/**
 * Represents a file associated with a media item.
 */
export interface MediaFile {
  id: number;
  code: string;
  name: string;
  width: number;
  height: number;
  size: number;
  format: MediaFormat;
  media: Media;
}

/**
 * Represents the extension of a media type.
 */
export interface MediaExt {
  code: string;
  name: string;
}

/**
 * Represents an event triggered by a file upload.
 */
export interface FileUploadEvent extends UploadEvent {
  files: File[];
}
