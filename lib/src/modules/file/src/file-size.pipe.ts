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

import {Pipe, PipeTransform} from "@angular/core";

/**
 * Pipe to transform file size into a human-readable format.
 */
@Pipe({
  name: "fileSize",
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  /**
   * Transforms a file size into a human-readable format (KB or MB).
   * @param value The file size in bytes.
   * @returns {string} The human-readable file size.
   */
  transform(value: number): string {
    if (value > 1024 * 500) {
      return (value / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (value / 1024).toFixed(2) + " KB";
    }
  }

}
